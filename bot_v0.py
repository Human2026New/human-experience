import sqlite3
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

# =====================
# BASE DE DADOS
# =====================
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        join_date TEXT
    )
    """)

    conn.commit()
    conn.close()


def user_exists(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT 1 FROM users WHERE user_id=?", (user_id,))
    exists = c.fetchone() is not None
    conn.close()
    return exists


def create_user(user_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(
        "INSERT INTO users (user_id, join_date) VALUES (?, ?)",
        (user_id, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()


# =====================
# COMANDO /start
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if not user_exists(user_id):
        create_user(user_id)
        await update.message.reply_text(
            "Bem-vindo à HUMAN.\n\n"
            "Aqui o tempo importa.\n"
            "Este é apenas o início."
        )
    else:
        await update.message.reply_text(
            "Já estás registado na HUMAN.\n"
            "A jornada continua."
        )


# =====================
# MAIN
# =====================
def main():
    init_db()

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("HUMAN bot v0 a correr...")
    app.run_polling()


if __name__ == "__main__":
    main()
