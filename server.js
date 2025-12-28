import express from 'express';
import { Telegraf } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// --- НАСТРОЙКИ ---
// Вставьте сюда токен, который дал BotFather
const BOT_TOKEN = process.env.BOT_TOKEN || '8530299630:AAHhytyU9jXllQd_rW5qIt2z0p_InnJAEWM';
const PORT = 3000;
const DB_FILE = './data/letters.json';

// Настройка путей для Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- БАЗА ДАННЫХ (Простой JSON файл) ---
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], letters: [] }));

const db = {
  read: () => JSON.parse(fs.readFileSync(DB_FILE)),
  write: (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
};

// --- БОТ ---
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const data = db.read();
  const user = ctx.from;
  
  // Сохраняем пользователя, чтобы знать, кому рассылать
  if (!data.users.find(u => u.id === user.id)) {
    data.users.push({ id: user.id, name: user.first_name, username: user.username });
    db.write(data);
    ctx.reply(`Привет, ${user.first_name}! Я сохранил тебя. Теперь открывай Web App и пиши письмо в будущее! 🎄`);
  } else {
    ctx.reply(`С возвращением! Ждем 2026 года...`);
  }
});

bot.launch();

// --- СЕРВЕР ---
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // Раздаем наш React сайт

// API для сохранения письма
app.post('/api/save-letter', (req, res) => {
  const { userId, username, text } = req.body;
  
  if (!userId || !text) return res.sendStatus(400);

  const data = db.read();
  
  // Удаляем старое письмо этого пользователя (если было) и пишем новое
  data.letters = data.letters.filter(l => l.userId !== userId);
  data.letters.push({ userId, username, text, date: new Date() });
  
  db.write(data);
  console.log(`Письмо от ${username} сохранено!`);
  
  res.json({ success: true });
});

// Любой другой запрос возвращает index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- ПЛАНИРОВЩИК (Рассылка) ---
// Проверка каждую минуту. Если наступило 1 января 2026 00:00
cron.schedule('* * * * *', async () => {
  const now = new Date();
  // ВАЖНО: Установите нужный год и время.
  // Для теста можно поставить текущий год и ближайшую минуту.
  if (now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() === 0) {
    
    console.log("⏰ ВРЕМЯ ПРИШЛО! НАЧИНАЮ РАССЫЛКУ...");
    const data = db.read();
    
    // Перебираем всех пользователей (получателей)
    for (const recipient of data.users) {
      let message = `🎄✨ **С НОВЫМ 2026 ГОДОМ!** ✨🎄\n\nВот письма от твоей семьи:\n\n`;
      let hasLetters = false;

      // Собираем письма от ВСЕХ остальных (кроме самого себя)
      for (const letter of data.letters) {
        if (letter.userId !== recipient.id) { // Не отправлять самому себе
          message += `📩 **От ${letter.username}:**\n"${letter.text}"\n\n`;
          hasLetters = true;
        }
      }

      if (hasLetters) {
        try {
          await bot.telegram.sendMessage(recipient.id, message, { parse_mode: 'Markdown' });
          console.log(`Sent to ${recipient.name}`);
        } catch (e) {
          console.error(`Failed to send to ${recipient.name}`, e);
        }
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Обработка остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));