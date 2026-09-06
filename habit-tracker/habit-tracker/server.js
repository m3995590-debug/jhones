// server.js
// Servidor Express simples que guarda os hábitos em um arquivo JSON local (data.json).
// Não usa banco de dados externo para manter o projeto fácil de rodar por qualquer pessoa.

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Persistência simples em arquivo ----------

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { habits: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return { habits: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Retorna a data de hoje no formato YYYY-MM-DD (sem hora), usando fuso local
function todayStr() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split('T')[0];
}

// Calcula a sequência atual (streak) de dias consecutivos concluídos,
// contando a partir de hoje (ou ontem, se hoje ainda não foi marcado)
function calculateStreak(completedDates) {
  const datesSet = new Set(completedDates);
  let streak = 0;
  let cursor = new Date();

  // Se hoje ainda não foi concluído, o streak "em andamento" começa a contar de ontem
  const todayKey = todayStr();
  if (!datesSet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const offset = cursor.getTimezoneOffset();
    const local = new Date(cursor.getTime() - offset * 60000);
    const key = local.toISOString().split('T')[0];
    if (datesSet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function serializeHabit(habit) {
  return {
    id: habit.id,
    name: habit.name,
    completedDates: habit.completedDates,
    streak: calculateStreak(habit.completedDates),
    doneToday: habit.completedDates.includes(todayStr()),
  };
}

// ---------- Rotas da API ----------

// Lista todos os hábitos
app.get('/api/habits', (req, res) => {
  const data = readData();
  res.json(data.habits.map(serializeHabit));
});

// Cria um novo hábito
app.post('/api/habits', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'O nome do hábito é obrigatório.' });
  }

  const data = readData();
  const newHabit = {
    id: Date.now().toString(),
    name: name.trim(),
    completedDates: [],
  };
  data.habits.push(newHabit);
  writeData(data);

  res.status(201).json(serializeHabit(newHabit));
});

// Marca (ou desmarca) o hábito como concluído hoje
app.post('/api/habits/:id/toggle', (req, res) => {
  const data = readData();
  const habit = data.habits.find((h) => h.id === req.params.id);
  if (!habit) {
    return res.status(404).json({ error: 'Hábito não encontrado.' });
  }

  const today = todayStr();
  const idx = habit.completedDates.indexOf(today);
  if (idx === -1) {
    habit.completedDates.push(today);
  } else {
    habit.completedDates.splice(idx, 1);
  }

  writeData(data);
  res.json(serializeHabit(habit));
});

// Remove um hábito
app.delete('/api/habits/:id', (req, res) => {
  const data = readData();
  const before = data.habits.length;
  data.habits = data.habits.filter((h) => h.id !== req.params.id);

  if (data.habits.length === before) {
    return res.status(404).json({ error: 'Hábito não encontrado.' });
  }

  writeData(data);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`✅ Habit Tracker rodando em http://localhost:${PORT}`);
});
