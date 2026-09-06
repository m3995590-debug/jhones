// app.js — lógica do front-end: busca hábitos na API e atualiza a tela

const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const list = document.getElementById('habit-list');
const emptyState = document.getElementById('empty-state');

async function fetchHabits() {
  const res = await fetch('/api/habits');
  const habits = await res.json();
  renderHabits(habits);
}

function renderHabits(habits) {
  list.innerHTML = '';
  emptyState.hidden = habits.length > 0;

  habits.forEach((habit) => {
    const li = document.createElement('li');
    li.className = 'habit-item' + (habit.doneToday ? ' done' : '');

    li.innerHTML = `
      <button class="habit-check" data-id="${habit.id}" title="Marcar como concluído hoje">
        ${habit.doneToday ? '✓' : ''}
      </button>
      <div class="habit-info">
        <p class="habit-name">${escapeHtml(habit.name)}</p>
        <span class="habit-streak">🔥 ${habit.streak} ${habit.streak === 1 ? 'dia' : 'dias'}</span>
      </div>
      <button class="habit-delete" data-id="${habit.id}" title="Excluir hábito">✕</button>
    `;

    list.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  await fetch('/api/habits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  input.value = '';
  fetchHabits();
});

list.addEventListener('click', async (e) => {
  const checkBtn = e.target.closest('.habit-check');
  const deleteBtn = e.target.closest('.habit-delete');

  if (checkBtn) {
    const id = checkBtn.dataset.id;
    await fetch(`/api/habits/${id}/toggle`, { method: 'POST' });
    fetchHabits();
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    if (confirm('Excluir este hábito?')) {
      await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      fetchHabits();
    }
  }
});

fetchHabits();
