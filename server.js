import 'dotenv/config';
import express from 'express';
import { Telegraf } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// --- НАСТРОЙКИ ---
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const DB_FILE = './data/letters.json';

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
  console.error("ОШИБКА: Не найден BOT_TOKEN!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const data = db.read();
  const user = ctx.from;
  
  if (!data.users.find(u => u.id === user.id)) {
    // По умолчанию ставим UTC, если он не откроет WebApp, но потом обновим
    data.users.push({ id: user.id, name: user.first_name, username: user.username, timezone: 'UTC', sent: false });
    db.write(data);
    ctx.reply(`Привет, ${user.first_name}! Я сохранил тебя. Теперь открывай Web App и пиши письмо в будущее! 🎄`);
  } else {
    ctx.reply(`С возвращением! Письмо можно перезаписать в любой момент до Нового Года.`);
  }
});

bot.launch();

// --- СЕРВЕР ---
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/save-letter', (req, res) => {
  const { userId, username, text, timezone } = req.body;
  if (!userId || !text) return res.sendStatus(400);

  const data = db.read();
  
  // 1. Обновляем часовой пояс пользователя в базе пользователей
  const userIndex = data.users.findIndex(u => u.id === userId);
  if (userIndex >= 0) {
      // Сохраняем таймзону (например 'Europe/Moscow') и сбрасываем флаг отправки
      data.users[userIndex].timezone = timezone || 'UTC';
      data.users[userIndex].sent = false; 
  } else {
      // Если вдруг пользователя нет (редкий случай), создаем
      data.users.push({ id: userId, name: username, username, timezone: timezone || 'UTC', sent: false });
  }

  // 2. Сохраняем само письмо
  data.letters = data.letters.filter(l => l.userId !== userId);
  data.letters.push({ userId, username, text, date: new Date() });
  
  db.write(data);
  console.log(`Письмо от ${username} сохранено! (TZ: ${timezone})`);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- УМНЫЙ ПЛАНИРОВЩИК (Мульти-Часовые Пояса) ---
cron.schedule('* * * * *', async () => {
  const data = db.read();
  const now = new Date();

  // Логируем раз в час, что сервер жив
  if (now.getMinutes() === 0) {
      console.log(`⏳ Проверка времени для ${data.users.length} пользователей...`);
  }

  for (const recipient of data.users) {
      // Если этому пользователю уже отправили в этом году - пропускаем
      if (recipient.sent) continue;

      // Получаем текущее время В ЧАСОВОМ ПОЯСЕ ПОЛЬЗОВАТЕЛЯ
      // Используем встроенный Intl для конвертации
      let userTimeStr;
      try {
          userTimeStr = now.toLocaleString("en-US", { timeZone: recipient.timezone });
      } catch (e) {
          // Если таймзона кривая, используем UTC
          userTimeStr = now.toLocaleString("en-US", { timeZone: "UTC" });
      }
      
      const userDate = new Date(userTimeStr);

      // ПРОВЕРКА: Наступил ли у НЕГО Новый Год? (2026, Январь, 1 число, 00:00)
      if (userDate.getFullYear() === 2026 && userDate.getMonth() === 0 && userDate.getDate() === 1 && userDate.getHours() === 0 && userDate.getMinutes() === 0) {
          
          console.log(`🎆 НОВЫЙ ГОД У ПОЛЬЗОВАТЕЛЯ ${recipient.name} (${recipient.timezone})! ОТПРАВЛЯЮ...`);
          
          let message = `🎄✨ **С НОВЫМ 2026 ГОДОМ!** ✨🎄\n\nВ твоем городе пробили куранты! Вот письма от семьи:\n\n`;
          let hasLetters = false;

          for (const letter of data.letters) {
            if (letter.userId !== recipient.id) {
              message += `📩 **От ${letter.username}:**\n"${letter.text}"\n\n`;
              hasLetters = true;
            }
          }

          if (hasLetters) {
            try {
              await bot.telegram.sendMessage(recipient.id, message, { parse_mode: 'Markdown' });
              console.log(`✅ Успешно отправлено: ${recipient.name}`);
              
              // Помечаем, что этому пользователю уже отправили
              recipient.sent = true;
              db.write(data);
              
            } catch (e) {
              console.error(`❌ Ошибка отправки ${recipient.name}:`, e.message);
            }
          } else {
             // Утешительное сообщение, если писем нет
             try {
                await bot.telegram.sendMessage(recipient.id, "🎄 С Новым Годом! К сожалению, письма от других пока не пришли, но мы поздравляем тебя!", { parse_mode: 'Markdown' });
                recipient.sent = true;
                db.write(data);
             } catch(e) {}
          }
      }
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));