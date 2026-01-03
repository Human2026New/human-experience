import sqlite3
import math
from datetime import datetime

from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes
)

# =====================
# CONFIGURAÇÃO
# =====================
TOKEN = "7642930214:AAFnbJzFjbBEbCy9_2TBelEJrhZjQVznOVc"
DB_NAME = "human.db"

MIN_HOURS = 20
MAX_HOURS = 36

MIN_REWARD = 0.1
MAX_REWARD = 2.0
MAX_RETURN_BONUS = 1.0

BASE_RATE = 0.002  # HUM/min visual

# =====================
# BASE DE DADOS
# =====================
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        join_date TEXT,
        last_checkin TEXT,
        streak INTEGER DEFAULT 0,
        hum_balance REAL DEFAULT 0.0,
        fail_count INTEGER DEFAULT 0,
        last_fail_hours REAL
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        user_id INTEGER PRIMARY KEY,
        session_start TEXT,
        last_seen TEXT,
        active_minutes REAL DEFAULT 0.0
    )
    """)

    conn.commit()
    conn.close()


def now():
    return datetime.utcnow()


def parse_time(ts):
    return datetime.fromisoformat(ts)


# =====================
# USER HELPERS
# =====================
def get_user(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE user_id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row


def create_user(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        INSERT INTO users (
            user_id, join_date, last_checkin,
            streak, hum_balance, fail_count, last_fail_hours
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, now().isoformat(), None, 0, 0.0, 0, None))
    conn.commit()
    conn.close()


def update_user(user_id, last_checkin, streak, balance, fail_count, last_fail_hours):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        UPDATE users
        SET last_checkin=?,
            streak=?,
            hum_balance=?,
            fail_count=?,
            last_fail_hours=?
        WHERE user_id=?
    """, (last_checkin, streak, balance, fail_count, last_fail_hours, user_id))
    conn.commit()
    conn.close()


# =====================
# SESSION HELPERS
# =====================
def get_session(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM sessions WHERE user_id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row


def start_or_update_session(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()

    session = get_session(user_id)
    now_time = now()

    if not session:
        c.execute("""
            INSERT INTO sessions (user_id, session_start, last_seen, active_minutes)
            VALUES (?, ?, ?, ?)
        """, (user_id, now_time.isoformat(), now_time.isoformat(), 0.0))
    else:
        _, _, last_seen, active_minutes = session
        last_seen_time = parse_time(last_seen)
        delta_min = (now_time - last_seen_time).total_seconds() / 60
        active_minutes += max(0, delta_min)

        c.execute("""
            UPDATE sessions
            SET last_seen=?, active_minutes=?
            WHERE user_id=?
        """, (now_time.isoformat(), active_minutes, user_id))

    conn.commit()
    conn.close()


# =====================
# LÓGICA HUMANA
# =====================
def calculate_reward(streak):
    reward = math.log2(streak + 1)
    return max(MIN_REWARD, min(MAX_REWARD, reward))


def calculate_return_bonus(hours_absent):
    bonus = math.log2(hours_absent + 1) * 0.1
    return min(MAX_RETURN_BONUS, bonus)


def calculate_visual_rate(streak):
    return BASE_RATE * math.log2(streak + 1)


# =====================
# COMANDOS
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not get_user(user_id):
        create_user(user_id)
    await update.message.reply_text(
        "Bem-vindo à HUMAN.\n\n"
        "Aqui o tempo trabalha contigo."
    )


async def mine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    start_or_update_session(user_id)
    session = get_session(user_id)

    _, _, _, streak, _, _, _ = user
    _, session_start, _, active_minutes = session

    rate = calculate_visual_rate(streak)
    progress = min(100, (active_minutes / (24 * 60)) * 100)

    await update.message.reply_text(
        f"⛏️ MINERAÇÃO ATIVA (visual)\n\n"
        f"Taxa atual: {rate:.4f} HUM/min\n"
        f"Tempo ativo: {int(active_minutes)} min\n"
        f"Progresso do ciclo: {progress:.1f}%\n\n"
        "O tempo continua a trabalhar.\n"
        "O HUM só entra quando o ciclo fecha."
    )


async def checkin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    (
        _,
        _,
        last_checkin,
        streak,
        balance,
        fail_count,
        _
    ) = user

    now_time = now()
    return_bonus = 0.0
    hours_absent = 0.0

    if last_checkin:
        last_time = parse_time(last_checkin)
        hours = (now_time - last_time).total_seconds() / 3600

        if hours < MIN_HOURS:
            await update.message.reply_text(
                "Ainda não.\nO tempo faz parte da prova."
            )
            return

        if hours <= MAX_HOURS:
            streak += 1
        else:
            streak = max(1, streak - 1)
            fail_count += 1
            hours_absent = hours
            return_bonus = calculate_return_bonus(hours_absent)
    else:
        streak = 1

    reward = calculate_reward(streak)
    balance += reward + return_bonus

    update_user(
        user_id,
        now_time.isoformat(),
        streak,
        balance,
        fail_count,
        hours_absent if return_bonus > 0 else None
    )

    await update.message.reply_text(
        f"⛏️ CICLO FECHADO\n\n"
        f"+{reward:.2f} HUM\n"
        f"{'+%.2f HUM (retorno)' % return_bonus if return_bonus > 0 else ''}\n\n"
        f"Streak: {streak} dias\n"
        f"Saldo: {balance:.2f} HUM\n\n"
        "O tempo foi contabilizado."
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    _, _, last_checkin, streak, balance, fail_count, _ = user

    await update.message.reply_text(
        f"📊 ESTADO HUMAN\n\n"
        f"Streak: {streak}\n"
        f"Falhas: {fail_count}\n"
        f"Saldo: {balance:.2f} HUM\n\n"
        f"Último check-in:\n{last_checkin if last_checkin else '—'}"
    )


# =====================
# MAIN
# =====================
def main():
    init_db()

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("mine", mine))
    app.add_handler(CommandHandler("checkin", checkin))
    app.add_handler(CommandHandler("status", status))

    print("HUMAN bot v4 (mineração visual) a correr...")
    app.run_polling()


if __name__ == "__main__":
    main()
