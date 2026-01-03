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
# CONFIG
# =====================
TOKEN = "7642930214:AAFnbJzFjbBEbCy9_2TBelEJrhZjQVznOVc"
DB_NAME = "human.db"

MIN_HOURS = 20
MAX_HOURS = 36

MIN_REWARD = 0.1
MAX_REWARD = 2.0
MAX_RETURN_BONUS = 1.0

BASE_RATE = 0.002

DUEL_WIN_REWARD = 0.5
DUEL_DRAW_REWARD = 0.25

# =====================
# DB INIT
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

    c.execute("""
    CREATE TABLE IF NOT EXISTS duels (
        duel_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a INTEGER,
        user_b INTEGER,
        start_date TEXT,
        end_date TEXT,
        score_a INTEGER DEFAULT 0,
        score_b INTEGER DEFAULT 0,
        status TEXT
    )
    """)

    conn.commit()
    conn.close()

# =====================
# HELPERS
# =====================
def now():
    return datetime.utcnow()

def parse(ts):
    return datetime.fromisoformat(ts)

def get_user(uid):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE user_id=?", (uid,))
    r = c.fetchone()
    conn.close()
    return r

def create_user(uid):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (uid, now().isoformat(), None, 0, 0.0, 0, None))
    conn.commit()
    conn.close()

def update_user(uid, last_checkin, streak, balance, fails, last_fail):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    UPDATE users SET
        last_checkin=?, streak=?, hum_balance=?, fail_count=?, last_fail_hours=?
    WHERE user_id=?
    """, (last_checkin, streak, balance, fails, last_fail, uid))
    conn.commit()
    conn.close()

# =====================
# DUEL HELPERS
# =====================
def create_duel(a, b, days):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    INSERT INTO duels (user_a, user_b, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?)
    """, (a, b, None, (now() + timedelta(days=days)).isoformat(), "pending"))
    conn.commit()
    conn.close()

def get_pending_duel(uid):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    SELECT * FROM duels
    WHERE user_b=? AND status='pending'
    """, (uid,))
    r = c.fetchone()
    conn.close()
    return r

def start_duel(duel_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    UPDATE duels
    SET status='active', start_date=?
    WHERE duel_id=?
    """, (now().isoformat(), duel_id))
    conn.commit()
    conn.close()

def update_duel_score(duel, uid):
    duel_id, a, b, start, end, sa, sb, status = duel
    if uid == a:
        sa += 1
    elif uid == b:
        sb += 1

    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
    UPDATE duels SET score_a=?, score_b=?
    WHERE duel_id=?
    """, (sa, sb, duel_id))
    conn.commit()
    conn.close()

# =====================
# COMMANDS
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    if not get_user(uid):
        create_user(uid)
    await update.message.reply_text("HUMAN ativo. Usa /checkin, /mine ou /duel.")

async def duel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    if len(context.args) != 2:
        await update.message.reply_text("Uso: /duel @user dias")
        return

    days = int(context.args[1])
    await update.message.reply_text(
        f"Desafio enviado para {context.args[0]} ({days} dias).\n"
        "À espera de aceitação."
    )

async def accept(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    duel = get_pending_duel(uid)
    if not duel:
        await update.message.reply_text("Nenhum duelo pendente.")
        return

    start_duel(duel[0])
    await update.message.reply_text("Duelo iniciado. Disciplina ativa.")

async def checkin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    user = get_user(uid)
    if not user:
        await update.message.reply_text("Usa /start.")
        return

    _, _, last, streak, bal, fails, _ = user
    now_t = now()
    bonus = 0

    if last:
        hours = (now_t - parse(last)).total_seconds() / 3600
        if hours < MIN_HOURS:
            await update.message.reply_text("Ainda não.")
            return
        if hours <= MAX_HOURS:
            streak += 1
        else:
            streak = max(1, streak - 1)
            fails += 1
            bonus = min(1.0, math.log2(hours + 1) * 0.1)
    else:
        streak = 1

    reward = max(MIN_REWARD, min(MAX_REWARD, math.log2(streak + 1)))
    bal += reward + bonus

    update_user(uid, now_t.isoformat(), streak, bal, fails, hours if bonus else None)

    await update.message.reply_text(
        f"Check-in OK.\n+{reward:.2f} HUM"
        f"{' + retorno' if bonus else ''}"
    )

# =====================
# MAIN
# =====================
def main():
    init_db()
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("duel", duel))
    app.add_handler(CommandHandler("accept", accept))
    app.add_handler(CommandHandler("checkin", checkin))
    print("HUMAN bot v5 (duelos) a correr...")
    app.run_polling()

if __name__ == "__main__":
    main()
