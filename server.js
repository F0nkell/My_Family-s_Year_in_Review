import 'dotenv/config'; // Подключаем чтение .env файла
import express from 'express';
import { Telegraf } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// --- НАСТРОЙКИ ---
const BOT_TOKEN = process.env.BOT_TOKEN;
// ВАЖНО: Для облака (Render) обязательно использовать process.env.PORT
const PORT = process.env.PORT || 3000; 
const DB_FILE = './data/letters.json';

// Настройка путей для Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- БАЗА ДАННЫХ ---
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], letters: [] }));

const db = {
  read: () => JSON.parse(fs.readFileSync(DB_FILE)),
  write: (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
};

// --- БОТ ---
if (!BOT_TOKEN) {
  console.error("ОШИБКА: Не найден BOT_TOKEN в .env файле или настройках сервера!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const data = db.read();
  const user = ctx.from;
  
  // Сохраняем пользователя
  if (!data.users.find(u => u.id === user.id)) {
    data.users.push({ id: user.id, name: user.first_name, username: user.username });
    db.write(data);
    ctx.reply(`Привет, ${user.first_name}! Я сохранил тебя. Теперь открывай Web App и пиши письмо в будущее! 🎄`);
  } else {
    ctx.reply(`С возвращением! Я готов принимать письма.`);
  }
});

bot.launch();

// --- СЕРВЕР ---
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API для сохранения письма
app.post('/api/save-letter', (req, res) => {
  const { userId, username, text } = req.body;
  
  if (!userId || !text) return res.sendStatus(400);

  const data = db.read();
  
  // Перезаписываем письмо пользователя
  data.letters = data.letters.filter(l => l.userId !== userId);
  data.letters.push({ userId, username, text, date: new Date() });
  
  db.write(data);
  console.log(`Письмо от ${username} сохранено!`);
  
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- ПЛАНИРОВЩИК (ТЕСТОВЫЙ РЕЖИМ) ---
// Запускается каждую минуту
cron.schedule('* * * * *', async () => {
  console.log("⏰ [ТЕСТ] Проверка рассылки...");
  
  // !!! ТЕСТОВЫЙ РЕЖИМ: МЫ УБРАЛИ ПРОВЕРКУ ДАТЫ !!!
  // if (now.getFullYear() === 2026 ...) <-- Это закомментировано
  
  // Условие всегда true для проверки работы
  if (true) {
    const data = db.read();
    
    // Если писем нет, ничего не делаем
    if (data.letters.length === 0) {
        console.log("📭 Писем пока нет.");
        return;
    }

    for (const recipient of data.users) {
      let message = `🎄✨ **ТЕСТОВАЯ РАССЫЛКА (ПРОВЕРКА)** ✨🎄\n\nВот письма от твоей семьи:\n\n`;
      let hasLetters = false;

      for (const letter of data.letters) {
        if (letter.userId !== recipient.id) {
          message += `📩 **От ${letter.username}:**\n"${letter.text}"\n\n`;
          hasLetters = true;
        }
      }

      // Отправляем только если есть чужие письма
      if (hasLetters) {
        try {
          await bot.telegram.sendMessage(recipient.id, message, { parse_mode: 'Markdown' });
          console.log(`✅ Отправлено пользователю: ${recipient.name}`);
        } catch (e) {
          console.error(`❌ Ошибка отправки для ${recipient.name}:`, e.message);
        }
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));