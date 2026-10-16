function isValidLocalDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31
  );
}

function getHeatMapPeriod(today) {
  if (!isValidLocalDateString(today)) {
    throw new RangeError('today debe ser una fecha local válida en formato AAAA-MM-DD');
  }

  const [year, month, day] = today.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const daysSinceMonday = (date.getDay() + 6) % 7;

  date.setDate(date.getDate() - daysSinceMonday - 11 * 7);

  const startDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  return { startDate, endDate: today };
}

function getWeeklyMinutes(sessions, today) {
  if (!isValidLocalDateString(today)) {
    throw new RangeError('today debe ser una fecha local válida en formato AAAA-MM-DD');
  }

  const [year, month, day] = today.split('-').map(Number);
  const monday = new Date(year, month - 1, day);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);

  const mondayString = [
    monday.getFullYear(),
    String(monday.getMonth() + 1).padStart(2, '0'),
    String(monday.getDate()).padStart(2, '0')
  ].join('-');

  return sessions
    .filter((session) => session.date >= mondayString && session.date <= today)
    .reduce((total, session) => total + session.minutes, 0);
}

function isValidWeeklyGoal(value) {
  return Number.isInteger(value) && value > 0;
}

function getActivityLevel(minutes, maximumMinutes) {
  if (!Number.isFinite(minutes) || minutes <= 0 || !Number.isFinite(maximumMinutes) || maximumMinutes <= 0) {
    return 'sin-actividad';
  }

  const ratio = minutes / maximumMinutes;

  if (ratio <= 0.25) {
    return 'nivel-1';
  }

  if (ratio <= 0.5) {
    return 'nivel-2';
  }

  if (ratio <= 0.75) {
    return 'nivel-3';
  }

  return 'nivel-4';
}

function getHeatMapDays(sessions, today) {
  const { startDate, endDate } = getHeatMapPeriod(today);
  const totals = new Map();

  if (Array.isArray(sessions)) {
    for (const session of sessions) {
      const rawDate = session && (session.fecha ?? session.date ?? session.dateString ?? session.fechaSesion);
      const minutesValue = Number(session && (session.minutos ?? session.minutes ?? 0));

      if (!isValidLocalDateString(rawDate)) {
        continue;
      }

      if (rawDate < startDate || rawDate > endDate || rawDate > today) {
        continue;
      }

      if (!Number.isFinite(minutesValue)) {
        continue;
      }

      const current = totals.get(rawDate) ?? { minutes: 0, sessionCount: 0 };
      current.minutes += minutesValue;
      current.sessionCount += 1;
      totals.set(rawDate, current);
    }
  }

  const maxMinutes = Array.from(totals.values()).reduce((max, entry) => Math.max(max, entry.minutes), 0);
  const days = [];

  const cursor = new Date(
    Number(startDate.slice(0, 4)),
    Number(startDate.slice(5, 7)) - 1,
    Number(startDate.slice(8, 10))
  );
  const end = new Date(
    Number(endDate.slice(0, 4)),
    Number(endDate.slice(5, 7)) - 1,
    Number(endDate.slice(8, 10))
  );

  while (cursor <= end) {
    const dateKey = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, '0'),
      String(cursor.getDate()).padStart(2, '0')
    ].join('-');

    const entry = totals.get(dateKey) ?? { minutes: 0, sessionCount: 0 };
    const level = getActivityLevel(entry.minutes, maxMinutes);

    days.push({
      date: dateKey,
      minutes: entry.minutes,
      sessionCount: entry.sessionCount,
      level
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    startDate,
    endDate,
    maximumMinutes: maxMinutes,
    days
  };
}

const HeatMapLogic = { getHeatMapPeriod, getWeeklyMinutes, isValidWeeklyGoal, getHeatMapDays, getActivityLevel };
globalThis.HeatMapLogic = HeatMapLogic;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeatMapLogic;
}
