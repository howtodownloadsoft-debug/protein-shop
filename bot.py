import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart

BOT_TOKEN = '8635826992:AAG5VeYToxRPP0PmfiAtv6IQqhguXEzeyI4'
SHOP_URL = 'https://protein-shop-sigma.vercel.app'

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def start(message: types.Message):
    kb = types.InlineKeyboardMarkup(inline_keyboard=[[
        types.InlineKeyboardButton(
            text='🛒 Открыть магазин',
            web_app=types.WebAppInfo(url=SHOP_URL)
        )
    ]])
    await message.answer(
        f'👋 Привет, {message.from_user.first_name}!\n\n'
        '⚡ Добро пожаловать в <b>SPLINTEL SHOP</b> — магазин спортивного питания.\n\n'
        '🥛 Протеин · 🌙 Казеин · ⚡ Креатин · 💪 Гейнер\n\n'
        '👇 Нажми кнопку чтобы открыть каталог:',
        reply_markup=kb,
        parse_mode='HTML'
    )

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
