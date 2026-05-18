const { db } = require('./db');

function getPlayerScore(game, player) {
  const fromPlayer = Number(player.score);
  if (Number.isFinite(fromPlayer) && fromPlayer >= 0) return fromPlayer;
  const fromScores = Number(game.scores[player.id]);
  if (Number.isFinite(fromScores) && fromScores >= 0) return fromScores;
  return 0;
}

function findWinner(game) {
  let winner = null;
  let bestScore = -1;
  for (const p of game.players) {
    const score = getPlayerScore(game, p);
    if (score > bestScore) {
      bestScore = score;
      winner = p;
    }
  }
  return winner;
}

/**
 * После окончания партии обновляет SQLite для зарегистрированных игроков (по userDbId).
 */
function recordQuizGameStats(game) {
  if (game.statsRecorded) {
    console.log('[Stats] Статистика уже записана, пропуск');
    return;
  }

  if (!game.players.length) return;

  const winner = findWinner(game);
  const winnerId = winner?.id ?? null;

  const incPlay = db.prepare(`
    UPDATE users
    SET games_played = games_played + 1,
        total_score = total_score + ?
    WHERE id = ?
  `);
  const incWin = db.prepare(`
    UPDATE users SET games_won = games_won + 1 WHERE id = ?
  `);

  let recordedCount = 0;

  for (const gp of game.players) {
    if (!gp.userDbId) {
      console.log(`[Stats] ${gp.name} — гость, статистика не пишется`);
      continue;
    }

    const score = getPlayerScore(game, gp);
    const isWinner = gp.id === winnerId;

    try {
      incPlay.run(score, gp.userDbId);
      if (isWinner) {
        incWin.run(gp.userDbId);
        console.log(`[Stats] ${gp.name} (user #${gp.userDbId}): +1 игра, +1 победа, +${score} очков`);
      } else {
        console.log(`[Stats] ${gp.name} (user #${gp.userDbId}): +1 игра, +${score} очков`);
      }
      recordedCount++;
    } catch (e) {
      console.error(`[Stats] Ошибка для ${gp.name}:`, e.message);
    }
  }

  game.statsRecorded = true;
  console.log(`[Stats] Записано для ${recordedCount} игрок(ов), победитель: ${winner?.name ?? '—'}`);
}

module.exports = { recordQuizGameStats };
