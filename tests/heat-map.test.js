const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const logicPath = path.join(__dirname, '..', 'logic.js');
const { getHeatMapPeriod, getHeatMapDays, getActivityLevel } = fs.existsSync(logicPath)
  ? require(logicPath)
  : {};

function calculatePeriod(today) {
  assert.equal(
    typeof getHeatMapPeriod,
    'function',
    'getHeatMapPeriod debe estar implementada en logic.js'
  );

  return getHeatMapPeriod(today);
}

function calculateDayTotals(sessions, today) {
  assert.equal(
    typeof getHeatMapDays,
    'function',
    'getHeatMapDays debe estar implementada en logic.js'
  );

  return getHeatMapDays(sessions, today);
}

test('calcula el periodo cuando hoy es lunes', () => {
  assert.deepEqual(calculatePeriod('2026-10-12'), {
    startDate: '2026-07-27',
    endDate: '2026-10-12'
  });
});

test('calcula el lunes inicial y conserva el domingo como último día', () => {
  assert.deepEqual(calculatePeriod('2026-10-18'), {
    startDate: '2026-07-27',
    endDate: '2026-10-18'
  });
});

test('calcula el periodo al cruzar fin de año', () => {
  assert.deepEqual(calculatePeriod('2025-01-01'), {
    startDate: '2024-10-14',
    endDate: '2025-01-01'
  });
});

test('calcula el periodo que incluye el día bisiesto', () => {
  assert.deepEqual(calculatePeriod('2024-03-03'), {
    startDate: '2023-12-11',
    endDate: '2024-03-03'
  });
});

test('agrega sesiones repetidas en el mismo día y no muta la entrada', () => {
  const sessions = [
    { id: 1, fecha: '2026-10-12', tema: 'JS', minutos: 30 },
    { id: 2, fecha: '2026-10-12', tema: 'SQL', minutos: 45 },
    { id: 3, fecha: '2026-10-13', tema: 'CSS', minutos: 20 }
  ];
  const original = JSON.parse(JSON.stringify(sessions));

  const result = calculateDayTotals(sessions, '2026-10-13');

  assert.equal(result.startDate, '2026-07-27');
  assert.equal(result.endDate, '2026-10-13');
  assert.equal(result.maximumMinutes, 75);
  assert.deepEqual(
    result.days.filter((day) => day.date === '2026-10-12' || day.date === '2026-10-13'),
    [
      { date: '2026-10-12', minutes: 75, sessionCount: 2, level: 'nivel-4' },
      { date: '2026-10-13', minutes: 20, sessionCount: 1, level: 'nivel-2' }
    ]
  );
  assert.deepEqual(sessions, original);
});

test('ignora sesiones futuras, fuera del periodo y con fecha inválida', () => {
  const sessions = [
    { id: 1, fecha: '2026-10-14', tema: 'Futuro', minutos: 90 },
    { id: 2, fecha: '2026-07-26', tema: 'Antes', minutos: 10 },
    { id: 3, fecha: '2026-10-12', tema: 'Hoy', minutos: 50 },
    { id: 4, fecha: '2026-10-12', tema: 'Otra', minutos: 25 },
    { id: 5, fecha: '2026-10-13', tema: 'Inválida', minutos: 15 },
    { id: 6, fecha: 'fecha-invalida', tema: 'No sirve', minutos: 99 }
  ];

  const result = calculateDayTotals(sessions, '2026-10-13');

  assert.equal(result.maximumMinutes, 75);
  assert.deepEqual(
    result.days.filter((day) => day.date === '2026-10-12' || day.date === '2026-10-13'),
    [
      { date: '2026-10-12', minutes: 75, sessionCount: 2, level: 'nivel-4' },
      { date: '2026-10-13', minutes: 15, sessionCount: 1, level: 'nivel-1' }
    ]
  );
});

test('clasifica los límites exactos e inmediatos de cada nivel', () => {
  const cases = [
    [24.9999, 100, 'nivel-1'],
    [25, 100, 'nivel-1'],
    [25.0001, 100, 'nivel-2'],
    [49.9999, 100, 'nivel-2'],
    [50, 100, 'nivel-2'],
    [50.0001, 100, 'nivel-3'],
    [74.9999, 100, 'nivel-3'],
    [75, 100, 'nivel-3'],
    [75.0001, 100, 'nivel-4'],
    [100, 100, 'nivel-4']
  ];

  for (const [minutes, maximumMinutes, expected] of cases) {
    assert.equal(getActivityLevel(minutes, maximumMinutes), expected);
  }
});

test('clasifica minutos fraccionarios sin redondear y deja los ceros sin actividad', () => {
  assert.equal(getActivityLevel(24.9999, 100), 'nivel-1');
  assert.equal(getActivityLevel(0.1, 0.4), 'nivel-1');
  assert.equal(getActivityLevel(0, 100), 'sin-actividad');
  assert.equal(getActivityLevel(1.5, 0), 'sin-actividad');
});
