const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const { getWeeklyMinutes, isValidWeeklyGoal } = require(path.join(__dirname, '..', 'logic.js'));

function calculateWeeklyMinutes(sessions, today) {
  assert.equal(
    typeof getWeeklyMinutes,
    'function',
    'getWeeklyMinutes debe estar implementada en logic.js'
  );

  return getWeeklyMinutes(sessions, today);
}

function validateWeeklyGoal(value) {
  assert.equal(
    typeof isValidWeeklyGoal,
    'function',
    'isValidWeeklyGoal debe estar implementada en logic.js'
  );

  return isValidWeeklyGoal(value);
}

test('suma lunes y hoy, incluye sesiones repetidas y excluye fechas previas y futuras', () => {
  const sessions = [
    { date: '2026-10-12', minutes: 20 },
    { date: '2026-10-14', minutes: 15 },
    { date: '2026-10-14', minutes: 8 },
    { date: '2026-10-11', minutes: 90 },
    { date: '2026-10-15', minutes: 70 }
  ];
  const original = JSON.parse(JSON.stringify(sessions));

  assert.equal(calculateWeeklyMinutes(sessions, '2026-10-14'), 43);
  assert.deepEqual(sessions, original);
});

test('cuando hoy es lunes solo incluye sesiones de hoy', () => {
  const sessions = [
    { date: '2026-10-11', minutes: 40 },
    { date: '2026-10-12', minutes: 12 },
    { date: '2026-10-13', minutes: 50 }
  ];

  assert.equal(calculateWeeklyMinutes(sessions, '2026-10-12'), 12);
});

test('suma la semana al cruzar de mes', () => {
  const sessions = [
    { date: '2026-08-31', minutes: 25 },
    { date: '2026-09-01', minutes: 10 },
    { date: '2026-08-30', minutes: 100 },
    { date: '2026-09-03', minutes: 60 }
  ];

  assert.equal(calculateWeeklyMinutes(sessions, '2026-09-02'), 35);
});

test('suma la semana al cruzar de año', () => {
  const sessions = [
    { date: '2025-12-29', minutes: 30 },
    { date: '2026-01-01', minutes: 18 },
    { date: '2025-12-28', minutes: 90 },
    { date: '2026-01-03', minutes: 75 }
  ];

  assert.equal(calculateWeeklyMinutes(sessions, '2026-01-02'), 48);
});

test('acepta objetivos semanales enteros positivos', () => {
  assert.equal(validateWeeklyGoal(1), true);
  assert.equal(validateWeeklyGoal(120), true);
});

test('rechaza cero como objetivo semanal', () => {
  assert.equal(validateWeeklyGoal(0), false);
});

test('rechaza objetivos semanales negativos', () => {
  assert.equal(validateWeeklyGoal(-1), false);
});

test('rechaza objetivos semanales fraccionarios', () => {
  assert.equal(validateWeeklyGoal(1.5), false);
  assert.equal(validateWeeklyGoal('120'), false);
});