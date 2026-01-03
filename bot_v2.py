import sqlite3
import math
from datetime import datetime, timedelta

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
        hum_balance REAL DEFAULT 0.0
    )
    """)

    conn.commit()
    conn.close()


def get_user(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE user_id=?", (user_id,))
    user = c.fetchone()
    conn.close()
    return user


def create_user(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        INSERT INTO users (user_id, join_date, last_checkin, streak, hum_balance)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, now(), None, 0, 0.0))
    conn.commit()
    conn.close()


def update_user(user_id, last_checkin, streak, hum_balance):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        UPDATE users
        SET last_checkin=?, streak=?, hum_balance=?
        WHERE user_id=?
    """, (last_checkin, streak, hum_balance, user_id))
    conn.commit()
    conn.close()


def now():
    return datetime.utcnow()


def parse_time(ts):
    return datetime.fromisoformat(ts)


# =====================
# LÓGICA HUMANA
# =====================
def calculate_reward(streak):
    reward = math.log2(streak + 1)
    return max(MIN_REWARD, min(MAX_REWARD, reward))


# =====================
# COMANDOS
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if not get_user(user_id):
        create_user(user_id)
        await update.message.reply_text(
            "Bem-vindo à HUMAN.\n\n"
            "Aqui o tempo é o trabalho.\n"
            "Check-in válido: 20h–36h."
        )
    else:
        await update.message.reply_text(
            "Já estás registado.\n"
            "A disciplina continua."
        )


async def checkin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    _, _, last_checkin, streak, balance = user
    now_time = now()

    if last_checkin:
        last_time = parse_time(last_checkin)
        delta = now_time - last_time
        hours = delta.total_seconds() / 3600

        if hours < MIN_HOURS:
            await update.message.reply_text(
                "Ainda não.\n"
                "O tempo faz parte da prova."
            )
            return

        if hours <= MAX_HOURS:
            streak += 1
        else:
            streak = max(1, streak - 1)
    else:
        streak = 1

    reward = calculate_reward(streak)
    balance += reward

    update_user(
        user_id,
        now_time.isoformat(),
        streak,
        balance
    )

    await update.message.reply_text(
        f"⛏️ Prova válida.\n\n"
        f"+{reward:.2f} HUM\n"
        f"Streak: {streak} dias\n"
        f"Saldo: {balance:.2f} HUM\n\n"
        "O tempo trabalhou contigo."
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    _, _, last_checkin, streak, balance = user

    msg = (
        f"📊 ESTADO HUMAN\n\n"
        f"Streak: {streak} dias\n"
        f"Saldo: {balance:.2f} HUM\n\n"
    )

    if last_checkin:
        msg += f"Último check-in:\n{last_checkin}"
    else:
        msg += "Ainda sem check-ins."

    await update.message.reply_text(msg)


# =====================
# MAIN
# =====================
def main():
    init_db()

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("checkin", checkin))
    app.add_handler(CommandHandler("status", status))

    print("HUMAN bot v2 (Fase 1) a correr...")
    app.run_polling()


if __name__ == "__main__":
    main()
