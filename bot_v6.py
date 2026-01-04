# =========================================
# HUMAN 2026 — Telegram Bot
# Version: v6.3 REWARDS INTEGRATED
# =========================================

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes
)
import requests

# ---------- CONFIG ----------
BOT_TOKEN = "7642930214:AAFnbJzFjbBEbCy9_2TBelEJrhZjQVznOVc"

WEBAPP_URL = "https://human2026new.github.io/human-experience/?v=4"
BACKEND_URL = "http://localhost:3000"


# ---------- HANDLERS ----------

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🔁 ENTRAR HOJE", callback_data="checkin")
        ],
        [
            InlineKeyboardButton("🧾 MEUS NFTs", callback_data="my_nfts")
        ],
        [
            InlineKeyboardButton(
                "ENTRAR NA HUMAN",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ])

    await update.message.reply_text(
        text="‎",
        reply_markup=keyboard
    )


async def handle_checkin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    telegram_id = str(query.from_user.id)

    try:
        r = requests.post(
            f"{BACKEND_URL}/presence/checkin",
            json={"telegram_id": telegram_id},
            timeout=5
        )
        data = r.json()
    except Exception:
        await query.edit_message_text("⚠️ Sistema indisponível.")
        return

    streak = data.get("streak", 0)
    status = data.get("status")

    if status == "already_checked":
        text = (
            "🌱 Presença já registada hoje.\n\n"
            f"🔥 Dias seguidos: {streak}"
        )
    else:
        if streak == 10:
            text = (
                "🎉 Presença validada.\n\n"
                "🟤 Recebeste: NFT BRONZE\n"
                "10 dias de continuidade."
            )
        elif streak == 30:
            text = (
                "🏆 Continuidade alcançada.\n\n"
                "⚪ Recebeste: NFT PRATA\n"
                "30 dias seguidos."
            )
        else:
            next_reward = "NFT Bronze (10 dias)" if streak < 10 else "NFT Prata (30 dias)"
            text = (
                "🔥 Presença registada.\n\n"
                f"📆 Dias seguidos: {streak}\n"
                f"🎯 Próximo marco: {next_reward}"
            )

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🔁 ENTRAR HOJE", callback_data="checkin")
        ],
        [
            InlineKeyboardButton("🧾 MEUS NFTs", callback_data="my_nfts")
        ],
        [
            InlineKeyboardButton(
                "ENTRAR NA HUMAN",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ])

    await query.edit_message_text(text=text, reply_markup=keyboard)


async def handle_my_nfts(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    telegram_id = str(query.from_user.id)

    try:
        r = requests.get(
            f"{BACKEND_URL}/rewards",
            params={"telegram_id": telegram_id},
            timeout=5
        )
        data = r.json()
    except Exception:
        await query.edit_message_text("⚠️ Erro ao carregar NFTs.")
        return

    rewards = data.get("rewards", [])

    if not rewards:
        text = (
            "🧾 MEUS NFTs\n\n"
            "Ainda não tens NFTs HUMAN.\n"
            "Continua presente."
        )
    else:
        text = "🧾 MEUS NFTs\n\n"
        for r in rewards:
            emoji = {
                "bronze": "🟤",
                "prata": "⚪",
                "ouro": "🟡",
                "diamante": "💎"
            }.get(r["type"], "🔹")

            text += f"{emoji} NFT {r['type'].upper()} — {r['source']}\n"

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("⬅️ VOLTAR", callback_data="start")
        ]
    ])

    await query.edit_message_text(text=text, reply_markup=keyboard)


# ---------- MAIN ----------
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_checkin, pattern="^checkin$"))
    app.add_handler(CallbackQueryHandler(handle_my_nfts, pattern="^my_nfts$"))

    print("🟢 HUMAN bot v6.3 ativo.")
    app.run_polling()


if __name__ == "__main__":
    main()
