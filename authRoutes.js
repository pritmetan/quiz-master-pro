const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./db');
const { COOKIE_NAME, JWT_SECRET, verifyToken } = require('./authCookie');

const router = express.Router();

const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeLogin(login) {
  return String(login || '').trim();
}

function validateLogin(login) {
  if (login.length < 3 || login.length > 24) return 'Логин: от 3 до 24 символов';
  if (!/^[a-zA-Zа-яА-ЯёЁ0-9._-]+$/.test(login)) {
    return 'Логин: только буквы, цифры, точка, дефис и подчёркивание';
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length < 6) return 'Пароль: минимум 6 символов';
  if (password.length > 128) return 'Пароль слишком длинный';
  return null;
}

function validateDisplayName(name) {
  const n = String(name || '').trim();
  if (n.length < 2 || n.length > 20) return 'Ник: от 2 до 20 символов';
  if (!/^[a-zA-Zа-яА-ЯёЁ0-9 _.-]+$/.test(n)) return 'Ник: недопустимые символы';
  return null;
}

function signToken(user) {
  return jwt.sign(
    { uid: user.id, login: user.login },
    JWT_SECRET,
    { expiresIn: Math.floor(TOKEN_MAX_AGE_MS / 1000) }
  );
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE_MS,
    path: '/'
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    login: row.login,
    displayName: row.display_name || row.login,
    createdAt: row.created_at,
    stats: {
      gamesPlayed: row.games_played ?? 0,
      gamesWon: row.games_won ?? 0,
      totalScore: row.total_score ?? 0
    }
  };
}

function getUserFromRequest(req) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  const payload = verifyToken(token);
  if (!payload || payload.uid == null) return null;
  const row = db
    .prepare(
      `SELECT id, login, display_name, created_at, games_played, games_won, total_score
       FROM users WHERE id = ?`
    )
    .get(Number(payload.uid));
  return rowToUser(row);
}

router.post('/register', (req, res) => {
  const login = normalizeLogin(req.body?.login);
  const password = req.body?.password;

  const errLogin = validateLogin(login);
  if (errLogin) return res.status(400).json({ ok: false, message: errLogin });
  const errPass = validatePassword(password);
  if (errPass) return res.status(400).json({ ok: false, message: errPass });

  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    db.prepare('INSERT INTO users (login, password_hash, display_name) VALUES (?, ?, ?)').run(
      login,
      passwordHash,
      login
    );
    return res.json({ ok: true, message: 'Регистрация успешна. Теперь войдите.' });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) {
      return res.status(409).json({ ok: false, message: 'Такой логин уже занят' });
    }
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Ошибка сервера' });
  }
});

router.post('/login', (req, res) => {
  const login = normalizeLogin(req.body?.login);
  const password = req.body?.password;
  if (!login || !password) {
    return res.status(400).json({ ok: false, message: 'Введите логин и пароль' });
  }

  const row = db
    .prepare(
      `SELECT id, login, password_hash, display_name, created_at, games_played, games_won, total_score
       FROM users WHERE login = ? COLLATE NOCASE`
    )
    .get(login);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ ok: false, message: 'Неверный логин или пароль' });
  }

  const token = signToken({ id: row.id, login: row.login });
  setAuthCookie(res, token);
  return res.json({ ok: true, user: rowToUser(row) });
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.json({ ok: true, user: null });
  return res.json({ ok: true, user });
});

router.patch('/profile', (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ ok: false, message: 'Не авторизован' });

  const displayName = String(req.body?.displayName ?? '').trim();
  const err = validateDisplayName(displayName);
  if (err) return res.status(400).json({ ok: false, message: err });

  db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(displayName, user.id);
  const row = db
    .prepare(
      `SELECT id, login, display_name, created_at, games_played, games_won, total_score FROM users WHERE id = ?`
    )
    .get(user.id);
  return res.json({ ok: true, user: rowToUser(row) });
});

module.exports = { router, getUserFromRequest, COOKIE_NAME };
