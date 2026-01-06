# =========================================
# HUMAN 2026 — Telegram Bot
# Version: v6.5 ONBOARDING + HUM UI + TOKEN HUM
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

# ---------- TOKEN HUM ----------
HUM_JETTON_ADDRESS = "EQCC2LH8-sEap7cfMZZIJOSVQ2aTWNUYIUEEKD8GeRYpB7oU"


# ---------- KEYBOARDS ----------
def main_menu_keyboard():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("📆 Marcar Presença", callback_data="checkin")],
        [InlineKeyboardButton("🧩 Tarefas Humanas", callback_data="tasks")],
        [InlineKeyboardButton("🪙 Token HUM", callback_data="token_hum")],
        [InlineKeyboardButton("🧾 Meus NFTs", callback_data="my_nfts")],
        [InlineKeyboardButton("🔄 Converter HUM", callback_data="convert")],
        [
            InlineKeyboardButton(
                "🌐 Entrar na HUMAN",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ])


# ---------- HANDLERS ----------

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        text=(
            "Bem-vindo ao HUMAN.\n\n"
            "Isto não é um jogo.\n"
            "Não é investimento.\n"
            "Não é promessa.\n\n"
            "É presença humana registada no tempo."
        ),
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("👤 Entrar como humano", callback_data="enter")]
        ])
    )


async def handle_enter(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    text = (
        "👤 Estado Humano\n\n"
        "Presença: 0 dias\n"
        "NFTs: 0\n\n"
        "HUM: 0\n"
        "TON: 0\n"
        "€: 0\n"
        "BTC: 0"
    )

    await query.edit_message_text(
        text=text,
        reply_markup=main_menu_keyboard()
    )


async def handle_token_hum(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    text = (
        "🪙 Token HUMAN (HUM)\n\n"
        "Rede: TON Mainnet\n\n"
        "Contrato oficial:\n"
        f"{HUM_JETTON_ADDRESS}\n\n"
        "Este é o endereço oficial do token HUM.\n"
        "Podes adicioná-lo manualmente na tua wallet TON."
    )

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton(
                "➕ Adicionar à Tonkeeper",
                url=f"https://app.tonkeeper.com/add-asset?address={HUM_JETTON_ADDRESS}"
            )
        ],
        [InlineKeyboardButton("⬅️ Voltar", callback_data="enter")]
    ])

    await query.edit_message_text(
        text=text,
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
        await query.edit_message_text(
            "⚠️ Sistema indisponível.",
            reply_markup=main_menu_keyboard()
        )
        return

    streak = data.get("streak", 0)
    status = data.get("status")

    if status == "already_checked":
        text = (
            "📆 Presença já registada hoje.\n\n"
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

    await query.edit_message_text(
        text=text,
        reply_markup=main_menu_keyboard()
    )


async def handle_tasks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    text = (
        "🧩 Tarefas Humanas\n\n"
        "Aqui não há spam.\n"
        "Nem promessas.\n\n"
        "✔️ Presença diária\n"
        "✔️ Continuidade\n\n"
        "Mais tarefas surgirão com o tempo."
    )

    await query.edit_message_text(
        text=text,
        reply_markup=main_menu_keyboard()
    )


async def handle_convert(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    text = (
        "🔄 Converter HUM → TON\n\n"
        "Estado: ⏳ Indisponível\n\n"
        "A conversão será ativada apenas quando\n"
        "existirem condições seguras no sistema."
    )

    await query.edit_message_text(
        text=text,
        reply_markup=main_menu_keyboard()
    )


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
        await query.edit_message_text(
            "⚠️ Erro ao carregar NFTs.",
            reply_markup=main_menu_keyboard()
        )
        return

    rewards = data.get("rewards", [])

    if not rewards:
        text = (
            "🧾 Meus NFTs\n\n"
            "Ainda não tens NFTs HUMAN.\n"
            "Continua presente."
        )
    else:
        text = "🧾 Meus NFTs\n\n"
        for r in rewards:
            emoji = {
                "bronze": "🟤",
                "prata": "⚪",
                "ouro": "🟡",
                "diamante": "💎"
            }.get(r.get("type"), "🔹")

            text += f"{emoji} NFT {r.get('type', '').upper()} — {r.get('source', '')}\n"

    await query.edit_message_text(
        text=text,
        reply_markup=main_menu_keyboard()
    )


# ---------- MAIN ----------
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_enter, pattern="^enter$"))
    app.add_handler(CallbackQueryHandler(handle_token_hum, pattern="^token_hum$"))
    app.add_handler(CallbackQueryHandler(handle_checkin, pattern="^checkin$"))
    app.add_handler(CallbackQueryHandler(handle_tasks, pattern="^tasks$"))
    app.add_handler(CallbackQueryHandler(handle_convert, pattern="^convert$"))
    app.add_handler(CallbackQueryHandler(handle_my_nfts, pattern="^my_nfts$"))

    print("🟢 HUMAN bot v6.5 ativo (base preservada).")
    app.run_polling()


if __name__ == "__main__":
    main()
