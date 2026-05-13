const { db } = require('./db');

/**
 * После окончания партии обновляет SQLite для зарегистрированных игроков (по userDbId).
 */
function recordQuizGameStats(game) {
  const results = game.getResults();
  const sorted = results.players;
  if (!sorted.length) return;

  const winnerId = sorted[0].id;
  const incPlay = db.prepare(`
    UPDATE users
    SET games_played = games_played + 1,
        total_score = total_score + ?
    WHERE id = ?
  `);
  const incWin = db.prepare(`
    UPDATE users SET games_won = games_won + 1 WHERE id = ?
  `);

  for (const p of sorted) {
    const gp = game.players.find((x) => x.id === p.id);
    if (!gp || !gp.userDbId) continue;
    incPlay.run(p.score, gp.userDbId);
    if (p.id === winnerId) incWin.run(gp.userDbId);
  }
}

module.exports = { recordQuizGameStats };
