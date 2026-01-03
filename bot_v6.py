# =========================================
# HUMAN 2026 — Telegram Bot (WebApp Gateway)
# Version: v6.1 FIXED
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
    ContextTypes
)

# ---------- CONFIG ----------
BOT_TOKEN = "7642930214:AAFnbJzFjbBEbCy9_2TBelEJrhZjQVznOVc"

WEBAPP_URL = "https://human2026new.github.io/human-experience/?v=4"


# ---------- HANDLERS ----------
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Porta única de entrada da HUMAN.
    UX silenciosa (texto mínimo exigido pela API).
    """

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton(
                text="ENTRAR NA HUMAN",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ])

    # Texto mínimo obrigatório pela API do Telegram
    await update.message.reply_text(
        text="‎",  # caractere invisível (U+200E)
        reply_markup=keyboard
    )


# ---------- MAIN ----------
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    print("🟢 HUMAN bot v6.1 ativo.")
    print("🔗 WebApp:", WEBAPP_URL)

    app.run_polling()


if __name__ == "__main__":
    main()
