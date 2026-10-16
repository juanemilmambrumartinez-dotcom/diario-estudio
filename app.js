const STORAGE_KEY = 'diario-de-estudio-sesiones';
const WEEKLY_GOAL_STORAGE_KEY = 'diario-de-estudio-objetivo-semanal';

const form = document.querySelector('#session-form');
const weeklyGoalForm = document.querySelector('#weekly-goal-form');
const weeklyGoalInput = document.querySelector('#weekly-goal-minutes');
const weeklyGoalMessage = document.querySelector('#weekly-goal-message');
const weeklyGoalInvitation = document.querySelector('#weekly-goal-invitation');
const weeklyGoalProgress = document.querySelector('#weekly-goal-progress');
const weeklyGoalCurrent = document.querySelector('#weekly-goal-current');
const weeklyGoalTarget = document.querySelector('#weekly-goal-target');
const weeklyGoalPercent = document.querySelector('#weekly-goal-percent');
const weeklyGoalMeter = document.querySelector('#weekly-goal-meter');
const weeklyGoalStatus = document.querySelector('#weekly-goal-status');
const dateInput = document.querySelector('#session-date');
const topicInput = document.querySelector('#session-topic');
const minutesInput = document.querySelector('#session-minutes');
const formMessage = document.querySelector('#form-message');
const sessionList = document.querySelector('#session-list');
const sessionTotal = document.querySelector('#session-total');
const weeklyMinutes = document.querySelector('#weekly-minutes');
const monthlyStudyDays = document.querySelector('#monthly-study-days');
const streakCount = document.querySelector('#streak-count');
const streakCountAnnouncement = document.querySelector('#streak-count-announcement');
const bestStreakCount = document.querySelector('#best-streak-count');
const streakCaption = document.querySelector('#streak-caption');
const sessionMessage = document.querySelector('#session-message');
const heatMapGrid = document.querySelector('#heat-map-grid');
const heatMapDetail = document.querySelector('#heat-map-detail');
const heatMapEmpty = document.querySelector('#heat-map-empty');
const minuteFormatter = new Intl.NumberFormat('es', { maximumFractionDigits: 2 });

let sessions = loadSessions();
let weeklyGoal = loadWeeklyGoal();
let hasRendered = false;
let weeklyGoalWasComplete = false;

dateInput.value = getLocalDateString(new Date());
if (weeklyGoal !== null) weeklyGoalInput.value = String(weeklyGoal);
render();

weeklyGoalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  weeklyGoalMessage.textContent = '';

  const goal = Number(weeklyGoalInput.value);
  if (!HeatMapLogic.isValidWeeklyGoal(goal)) {
    weeklyGoalMessage.textContent = 'El objetivo debe ser un número entero mayor que 0.';
    weeklyGoalInput.focus();
    return;
  }

  try {
    localStorage.setItem(WEEKLY_GOAL_STORAGE_KEY, String(goal));
  } catch {
    weeklyGoalMessage.textContent = 'No se pudo guardar el objetivo en este navegador.';
    return;
  }

  weeklyGoal = goal;
  weeklyGoalInput.value = String(weeklyGoal);
  render();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.textContent = '';

  const topic = topicInput.value.trim();
  const minutes = Number(minutesInput.value);

  if (!dateInput.value) {
    showError('Elige una fecha para la sesión.');
    dateInput.focus();
    return;
  }

  if (!isValidDateString(dateInput.value)) {
    showError('La fecha no es válida.');
    dateInput.focus();
    return;
  }

  if (!topic) {
    showError('Escribe el tema que has estudiado.');
    topicInput.focus();
    return;
  }

  if (!Number.isFinite(minutes) || minutes <= 0) {
    showError('Los minutos deben ser un número mayor que 0.');
    minutesInput.focus();
    return;
  }

  sessions.push({ date: dateInput.value, topic, minutes });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    sessions.pop();
    showError('No se pudo guardar la sesión en este navegador.');
    return;
  }

  form.reset();
  dateInput.value = getLocalDateString(new Date());
  render();
  topicInput.focus();
});

function loadSessions() {
  try {
    const savedSessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(savedSessions)) return [];

    return savedSessions.filter((session) =>
      session &&
      isValidDateString(session.date) &&
      typeof session.topic === 'string' &&
      session.topic.trim() !== '' &&
      Number.isFinite(session.minutes) &&
      session.minutes > 0
    );
  } catch {
    return [];
  }
}

function loadWeeklyGoal() {
  try {
    const savedGoal = localStorage.getItem(WEEKLY_GOAL_STORAGE_KEY);
    if (savedGoal === null) return null;

    const goal = Number(savedGoal);
    return HeatMapLogic.isValidWeeklyGoal(goal) ? goal : null;
  } catch {
    return null;
  }
}

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
}

function getPreviousDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getLocalDateString(date);
}

function getNextDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return getLocalDateString(date);
}

function calculateStreak() {
  const studiedDates = new Set(sessions.map((session) => session.date));
  const today = getLocalDateString(new Date());
  const yesterday = getPreviousDate(today);

  // La racha sigue viva hoy si ya se estudió hoy o ayer.
  if (!studiedDates.has(today) && !studiedDates.has(yesterday)) return 0;

  let streak = 0;
  let currentDate = studiedDates.has(today) ? today : yesterday;

  // Cuenta días locales consecutivos y no incluye fechas futuras.
  while (studiedDates.has(currentDate)) {
    streak += 1;
    currentDate = getPreviousDate(currentDate);
  }

  return streak;
}

function calculateBestStreak() {
  const today = getLocalDateString(new Date());
  const studiedDates = [...new Set(sessions.map((session) => session.date))]
    .filter((date) => date <= today)
    .sort();

  let bestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  // Recorre días locales únicos y reinicia el tramo cuando hay un salto.
  studiedDates.forEach((date) => {
    currentStreak = previousDate !== null && date === getNextDate(previousDate)
      ? currentStreak + 1
      : 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    previousDate = date;
  });

  return Math.max(bestStreak, calculateStreak());
}

function calculateMonthlyStudyDays() {
  const today = getLocalDateString(new Date());
  const currentMonth = today.slice(0, 7);

  return new Set(
    sessions
      .map((session) => session.date)
      .filter((date) => date.startsWith(`${currentMonth}-`) && date <= today)
  ).size;
}

function renderHeatMap() {
  const today = getLocalDateString(new Date());
  const result = HeatMapLogic.getHeatMapDays(sessions, today);
  const daysByDate = new Map(result.days.map((day) => [day.date, day]));
  const cursor = new Date(
    Number(result.startDate.slice(0, 4)),
    Number(result.startDate.slice(5, 7)) - 1,
    Number(result.startDate.slice(8, 10))
  );
  const cells = [];
  let hasActivity = false;

  for (let index = 0; index < 12 * 7; index += 1) {
    const date = getLocalDateString(cursor);
    const day = daysByDate.get(date);

    if (day) {
      const cell = document.createElement('button');
      const levelLabel = day.level === 'sin-actividad'
        ? 'sin actividad'
        : day.level.replace('nivel-', 'nivel ');
      const details = `${formatDate(day.date)}, ${minuteFormatter.format(day.minutes)} min, ${day.sessionCount} ${
        day.sessionCount === 1 ? 'sesión' : 'sesiones'
      }, ${levelLabel}`;

      cell.className = `heat-map-cell heat-map-cell--${day.level}`;
      cell.type = 'button';
      cell.setAttribute('aria-label', details);
      cell.title = details;
      cell.addEventListener('pointerenter', () => showHeatMapDetail(day));
      cell.addEventListener('focus', () => showHeatMapDetail(day));
      cell.addEventListener('click', () => showHeatMapDetail(day));
      cells.push(cell);

      if (day.minutes > 0) hasActivity = true;
    } else {
      const cell = document.createElement('span');
      cell.className = 'heat-map-cell heat-map-cell--empty';
      cell.setAttribute('aria-hidden', 'true');
      cells.push(cell);
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  heatMapGrid.replaceChildren(...cells);
  heatMapEmpty.hidden = hasActivity;
  if (!hasActivity) {
    heatMapDetail.textContent = 'Selecciona un día del mapa para consultar sus detalles.';
  }
}

function showHeatMapDetail(day) {
  const sessionLabel = day.sessionCount === 1 ? 'sesión' : 'sesiones';
  heatMapDetail.textContent =
    `${formatDate(day.date)}: ${minuteFormatter.format(day.minutes)} min, ${day.sessionCount} ${sessionLabel}.`;
}

function renderWeeklyGoal(today) {
  const hasWeeklyGoal = weeklyGoal !== null;
  weeklyGoalInvitation.hidden = hasWeeklyGoal;
  weeklyGoalProgress.hidden = !hasWeeklyGoal;
  if (!hasWeeklyGoal) {
    weeklyGoalProgress.dataset.state = 'empty';
    weeklyGoalProgress.classList.remove('celebrating');
    weeklyGoalProgress.style.setProperty('--goal-progress-scale', '0');
    weeklyGoalMeter.setAttribute('aria-valuenow', '0');
    weeklyGoalPercent.textContent = '0';
    weeklyGoalWasComplete = false;
    return;
  }

  const minutes = HeatMapLogic.getWeeklyMinutes(sessions, today);
  weeklyGoalCurrent.textContent = minuteFormatter.format(minutes);
  weeklyGoalTarget.textContent = minuteFormatter.format(weeklyGoal);
  const progressPercent = (minutes / weeklyGoal) * 100;
  const fillScale = Math.min(progressPercent / 100, 1);
  const animateInitialFill = !hasRendered && !prefersReducedMotion();
  if (animateInitialFill) {
    weeklyGoalProgress.style.setProperty('--goal-progress-scale', '0');
    requestAnimationFrame(() => {
      weeklyGoalProgress.style.setProperty('--goal-progress-scale', String(fillScale));
    });
  } else {
    weeklyGoalProgress.style.setProperty('--goal-progress-scale', String(fillScale));
  }
  weeklyGoalPercent.textContent = minuteFormatter.format(progressPercent);
  weeklyGoalMeter.setAttribute('aria-valuenow', String(Math.min(progressPercent, 100)));
  weeklyGoalProgress.dataset.state = minutes < weeklyGoal ? 'in-progress' : 'complete';

  const isComplete = minutes >= weeklyGoal;
  if (isComplete && !weeklyGoalWasComplete && !prefersReducedMotion()) {
    weeklyGoalProgress.classList.add('celebrating');
    window.setTimeout(() => weeklyGoalProgress.classList.remove('celebrating'), 1600);
  }
  weeklyGoalWasComplete = isComplete;

  if (minutes < weeklyGoal) {
    weeklyGoalStatus.textContent = `Te faltan ${minuteFormatter.format(weeklyGoal - minutes)} min para cumplir tu objetivo.`;
  } else if (minutes === weeklyGoal) {
    weeklyGoalStatus.textContent = '¡Objetivo cumplido!';
  } else {
    weeklyGoalStatus.textContent = `¡Objetivo cumplido! Has estudiado ${minuteFormatter.format(minutes)} min y superas el objetivo por ${minuteFormatter.format(minutes - weeklyGoal)} min.`;
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function updateStreakCount(value, animate) {
  streakCountAnnouncement.textContent = `Racha actual: ${value} ${value === 1 ? 'día' : 'días'}.`;
  if (!animate || prefersReducedMotion()) {
    streakCount.textContent = String(value);
    return;
  }

  const duration = 500;
  const startTime = performance.now();
  streakCount.textContent = '0';

  function updateFrame(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    streakCount.textContent = String(Math.round(value * easedProgress));
    if (progress < 1) requestAnimationFrame(updateFrame);
  }

  requestAnimationFrame(updateFrame);
}

function render() {
  renderHeatMap();
  const today = getLocalDateString(new Date());

  const orderedSessions = sessions
    .map((session, index) => ({ ...session, index }))
    .sort((first, second) => {
      if (first.date !== second.date) return second.date.localeCompare(first.date);
      return second.index - first.index;
    });

  sessionList.replaceChildren();
  sessionMessage.textContent = '';
  sessionTotal.textContent = String(sessions.length);
  const currentWeeklyMinutes = HeatMapLogic.getWeeklyMinutes(sessions, today);
  weeklyMinutes.textContent = `${minuteFormatter.format(currentWeeklyMinutes)} min`;
  renderWeeklyGoal(today);
  monthlyStudyDays.textContent = String(calculateMonthlyStudyDays());
  updateStreakCount(calculateStreak(), !hasRendered);
  bestStreakCount.textContent = String(calculateBestStreak());
  streakCaption.textContent = sessions.length === 0
    ? 'Tu primera sesión empieza la racha.'
    : 'Días seguidos estudiando';
  hasRendered = true;

  if (orderedSessions.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = 'Todavía no hay sesiones. ¡Registra la primera!';
    sessionList.append(emptyMessage);
    return;
  }

  orderedSessions.forEach((session) => {
    const item = document.createElement('li');
    item.className = 'session-item';

    const topic = document.createElement('span');
    topic.className = 'session-topic';
    topic.textContent = session.topic;

    const date = document.createElement('time');
    date.className = 'session-date';
    date.dateTime = session.date;
    date.textContent = formatDate(session.date);

    const minutes = document.createElement('span');
    minutes.className = 'session-minutes';
    minutes.textContent = `${session.minutes} min`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-session-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Borrar';
    deleteButton.setAttribute('aria-label', `Borrar sesión: ${session.topic}`);
    deleteButton.addEventListener('click', () => deleteSession(session.index));

    item.append(topic, date, minutes, deleteButton);
    sessionList.append(item);
  });
}

function deleteSession(index) {
  const session = sessions[index];
  if (!session) return;

  const confirmed = window.confirm(
    `¿Quieres borrar la sesión «${session.topic}» del ${formatDate(session.date)}?`
  );
  if (!confirmed) return;

  const updatedSessions = sessions.filter((_, currentIndex) => currentIndex !== index);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch {
    sessionMessage.textContent = 'No se pudo borrar la sesión. Comprueba el almacenamiento del navegador.';
    return;
  }

  sessions = updatedSessions;
  formMessage.textContent = '';
  render();
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function showError(message) {
  formMessage.textContent = message;
}