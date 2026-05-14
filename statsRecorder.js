const { db } = require('./db');

/**
 * После окончания партии обновляет SQLite для зарегистрированных игроков (по userDbId).
 * Гарантирует что статистика записывается только один раз и только для авторизованных пользователей.
 */
function recordQuizGameStats(game) {
  // Защита от повторного вызова
  if (game.statsRecorded) {
    console.log('[Stats] Статистика уже была записана для этой игры, пропускаем');
    return;
  }

  const results = game.getResults();
  const sorted = results.players;
  if (!sorted.length) return;

  // Находим победителя
  const winnerId = sorted[0].id;
  
  // Подготавливаем SQL запросы
  const incPlay = db.prepare(`
    UPDATE users
    SET games_played = games_played + 1,
        total_score = total_score + ?
    WHERE id = ?
  `);
  const incWin = db.prepare(`
    UPDATE users SET games_won = games_won + 1 WHERE id = ?
  `);

  // Записываем статистику только для авторизованных игроков
  let recordedCount = 0;
  for (const p of sorted) {
    // Ищем соответствующего игрока в объекте игры
    const gp = game.players.find((x) => x.id === p.id);
    
    // Пропускаем если игрок не найден или не авторизован
    if (!gp || !gp.userDbId) {
      console.log(`[Stats] Игрок ${gp?.name || p.id} пропущен (не авторизован)`);
      continue;
    }

    // Обновляем статистику для авторизованного игрока
    try {
      incPlay.run(p.score, gp.userDbId);
      if (p.id === winnerId) {
        incWin.run(gp.userDbId);
        console.log(`[Stats] ${gp.name} (ID:${gp.userDbId}): +1 игра, +1 победа, +${p.score} очков`);
      } else {
        console.log(`[Stats] ${gp.name} (ID:${gp.userDbId}): +1 игра, +${p.score} очков`);
      }
      recordedCount++;
    } catch (e) {
      console.error(`[Stats] Ошибка при обновлении статистики для ${gp.name}:`, e.message);
    }
  }

  // Отмечаем что статистика записана
  game.statsRecorded = true;
  console.log(`[Stats] Статистика записана для ${recordedCount} авторизованных игроков`);
}

module.exports = { recordQuizGameStats };
