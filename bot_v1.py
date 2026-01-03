import sqlite3
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
    return datetime.utcnow().isoformat()


def parse_time(ts):
    return datetime.fromisoformat(ts)


# =====================
# COMANDOS
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if not get_user(user_id):
        create_user(user_id)
        await update.message.reply_text(
            "Bem-vindo à HUMAN.\n\n"
            "Aqui medimos consistência humana.\n"
            "Usa /checkin uma vez por dia."
        )
    else:
        await update.message.reply_text(
            "Já estás registado na HUMAN.\n"
            "A consistência continua."
        )


async def checkin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    _, _, last_checkin, streak, balance = user
    now_time = datetime.utcnow()

    if last_checkin:
        last_time = parse_time(last_checkin)
        if now_time.date() == last_time.date():
            await update.message.reply_text(
                "Já fizeste check-in hoje.\n"
                "O tempo também conta."
            )
            return

        if now_time.date() - last_time.date() == timedelta(days=1):
            streak += 1
        else:
            streak = 1
    else:
        streak = 1

    balance += 1.0

    update_user(user_id, now(), streak, balance)

    await update.message.reply_text(
        f"Check-in registado.\n\n"
        f"+1 HUM\n"
        f"Streak: {streak} dias\n"
        f"Saldo: {balance:.1f} HUM"
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user = get_user(user_id)

    if not user:
        await update.message.reply_text("Usa /start primeiro.")
        return

    _, join_date, last_checkin, streak, balance = user

    msg = (
        f"📊 ESTADO HUMAN\n\n"
        f"Streak: {streak} dias\n"
        f"Saldo HUM: {balance:.1f}\n\n"
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

    print("HUMAN bot v1 a correr...")
    app.run_polling()


if __name__ == "__main__":
    main()
