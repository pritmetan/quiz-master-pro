const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const QuizGame = require('./quiz');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Клиент лежит рядом с папкой server: ../client
app.use(express.static(path.join(__dirname, '..', 'client')));

const lobbies = new Map();
const socketToLobby = new Map();
const socketToPlayer = new Map();
const chatMessages = new Map(); // история сообщений для каждого лобби

function generateLobbyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  if (lobbies.has(code)) return generateLobbyCode();
  return code;
}

io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);
  
  socket.playerData = { id: socket.id, name: null, lobbyCode: null };
  socketToPlayer.set(socket.id, socket.playerData);

  // СОЗДАНИЕ ЛОББИ
  socket.on('createLobby', (playerName) => {
    const name = playerName.trim();
    if (!name) return socket.emit('lobbyError', { message: 'Введите имя' });
    
    const code = generateLobbyCode();
    const game = new QuizGame();
    game.addPlayer(socket.id, name);
    
    lobbies.set(code, { game, playerIds: [socket.id] });
    socketToLobby.set(socket.id, code);
    socket.join(code);
    
    chatMessages.set(code, []);
    
    socket.playerData.name = name;
    socket.playerData.lobbyCode = code;
    
    socket.emit('lobbyCreated', { code, playerId: socket.id });
    io.to(code).emit('gameStateUpdate', game.getGameState());
    
    console.log('Лобби создано:', code, 'Хост:', name);
  });

  // ПРИСОЕДИНЕНИЕ К ЛОББИ
  socket.on('joinLobby', (data) => {
    const name = data.playerName.trim();
    const code = data.lobbyCode.toUpperCase().trim();
    
    if (!name) return socket.emit('lobbyError', { message: 'Введите имя' });
    
    const lobby = lobbies.get(code);
    if (!lobby) return socket.emit('lobbyError', { message: 'Лобби не найдено' });
    if (lobby.game.players.length >= 8) return socket.emit('lobbyError', { message: 'Лобби заполнено' });
    
    const success = lobby.game.addPlayer(socket.id, name);
    if (!success) return socket.emit('lobbyError', { message: 'Не удалось присоединиться' });
    
    lobby.playerIds.push(socket.id);
    socketToLobby.set(socket.id, code);
    socket.join(code);
    
    socket.playerData.name = name;
    socket.playerData.lobbyCode = code;
    
    socket.emit('gameJoined', { playerId: socket.id });
    io.to(code).emit('gameStateUpdate', lobby.game.getGameState());
    
    // Системное сообщение чата о новом игроке
    const joinMsg = {
      senderId: 'system',
      senderName: 'Система',
      message: `Игрок ${name} присоединился к лобби`,
      timestamp: Date.now()
    };
    io.to(code).emit('chatMessage', joinMsg);
    const msgs = chatMessages.get(code) || [];
    msgs.push(joinMsg);
    chatMessages.set(code, msgs);
    
    console.log('Игрок присоединился:', name, 'К лобби:', code);
  });

  // ЧАТ: подключение к чату
  socket.on('joinChat', (data) => {
    const { lobbyCode, playerId, playerName } = data;
    if (!lobbies.has(lobbyCode)) return socket.emit('chatError', { message: 'Лобби не найдено' });
    const lobby = lobbies.get(lobbyCode);
    if (!lobby.playerIds.includes(playerId)) return socket.emit('chatError', { message: 'Вы не в этом лобби' });
    
    socket.playerData.lobbyCode = lobbyCode;
    socket.emit('chatConnected', { lobbyCode, playerId });
  });

  // ЧАТ: получение истории
  socket.on('getChatHistory', (data) => {
    const { lobbyCode } = data;
    const messages = chatMessages.get(lobbyCode) || [];
    socket.emit('chatHistory', { messages });
  });

  // ЧАТ: отправка сообщения (только общий чат)
  socket.on('chatMessage', (data) => {
    const { lobbyCode, senderId, senderName, message, timestamp } = data;
    if (!lobbies.has(lobbyCode)) return socket.emit('chatError', { message: 'Лобби не найдено' });
    const lobby = lobbies.get(lobbyCode);
    if (!lobby.playerIds.includes(senderId)) return socket.emit('chatError', { message: 'Вы не в этом лобби' });
    
    const trimmed = message.substring(0, 500);
    const chatMsg = {
      senderId,
      senderName,
      message: trimmed,
      timestamp: timestamp || Date.now()
    };
    
    const msgs = chatMessages.get(lobbyCode) || [];
    msgs.push(chatMsg);
    if (msgs.length > 200) msgs.splice(0, msgs.length - 200);
    chatMessages.set(lobbyCode, msgs);
    
    io.to(lobbyCode).emit('chatMessage', chatMsg);
  });

  // ОБНОВЛЕНИЕ НАСТРОЕК
  socket.on('updateSettings', (settings) => {
    const code = socketToLobby.get(socket.id);
    if (!code) return socket.emit('lobbyError', { message: 'Вы не в лобби' });
    const lobby = lobbies.get(code);
    if (!lobby || !lobby.game) return;
    const game = lobby.game;
    if (game.host !== socket.id) return socket.emit('lobbyError', { message: 'Только хост' });
    
    const validSettings = {
      questionCount: Math.min(Math.max(parseInt(settings.questionCount) || 10, 1), 30),
      difficulty: ['easy', 'medium', 'hard'].includes(settings.difficulty) ? settings.difficulty : 'medium',
      timePerQuestion: Math.min(Math.max(parseInt(settings.timePerQuestion) || 20, 5), 60),
      maxErrors: Math.min(Math.max(parseInt(settings.maxErrors) || 1, 0), 5)
    };
    
    if (game.updateSettings(validSettings)) {
      game.gameState = 'settings';
      io.to(code).emit('gameStateUpdate', game.getGameState());
      io.to(code).emit('settingsUpdated', validSettings);
    } else {
      socket.emit('lobbyError', { message: 'Не удалось обновить настройки' });
    }
  });

  // НАЧАТЬ ИГРУ
  socket.on('startGame', () => {
    const code = socketToLobby.get(socket.id);
    if (!code) return;
    const lobby = lobbies.get(code);
    if (!lobby || !lobby.game) return;
    const game = lobby.game;
    if (game.host !== socket.id) return;
    
    if (game.startGame()) {
      game.gameState = 'question';
      io.to(code).emit('gameStateUpdate', game.getGameState());
      io.to(code).emit('gameStarted');
      
      const startMsg = {
        senderId: 'system',
        senderName: 'Система',
        message: 'Игра началась! Удачи!',
        timestamp: Date.now()
      };
      io.to(code).emit('chatMessage', startMsg);
      const msgs = chatMessages.get(code) || [];
      msgs.push(startMsg);
      chatMessages.set(code, msgs);
      
      startQuestionTimer(code);
    }
  });

  // ОТПРАВИТЬ ОТВЕТ
  socket.on('submitAnswer', (answerIndex) => {
    const code = socketToLobby.get(socket.id);
    if (!code) return;
    const lobby = lobbies.get(code);
    if (!lobby || !lobby.game) return;
    const game = lobby.game;
    if (game.gameState !== 'question') return;
    
    if (game.submitAnswer(socket.id, answerIndex)) {
      const answerData = game.answers[socket.id];
      socket.emit('answerSubmitted', { 
        isCorrect: answerData.isCorrect,
        errors: game.playerErrors[socket.id] || 0,
        maxErrors: game.settings.maxErrors
      });
      
      const allAnswered = game.players.every(p => game.answers[p.id]?.isFinal === true);
      if (allAnswered) {
        if (game.timer) { clearInterval(game.timer); game.timer = null; }
        game.gameState = 'answer';
        io.to(code).emit('gameStateUpdate', game.getGameState());
      } else {
        io.to(code).emit('gameStateUpdate', game.getGameState());
      }
    }
  });

  // СЛЕДУЮЩИЙ ВОПРОС
  socket.on('nextQuestion', () => {
    const code = socketToLobby.get(socket.id);
    if (!code) return;
    const lobby = lobbies.get(code);
    if (!lobby || !lobby.game) return;
    const game = lobby.game;
    if (game.host !== socket.id) return;
    
    if (game.nextQuestion()) {
      game.gameState = 'question';
      io.to(code).emit('gameStateUpdate', game.getGameState());
      startQuestionTimer(code);
    } else {
      game.gameState = 'results';
      io.to(code).emit('gameStateUpdate', game.getGameState());
      io.to(code).emit('gameFinished', game.getResults());
    }
  });

  // ОТКЛЮЧЕНИЕ
  socket.on('disconnect', () => {
    const code = socketToLobby.get(socket.id);
    const playerData = socketToPlayer.get(socket.id);
    socketToLobby.delete(socket.id);
    socketToPlayer.delete(socket.id);
    
    if (!code) return;
    const lobby = lobbies.get(code);
    if (!lobby) return;

    const beforeCount = lobby.playerIds.length;
    
    if (playerData && playerData.name) {
      const leaveMsg = {
        senderId: 'system',
        senderName: 'Система',
        message: `Игрок ${playerData.name} вышел из игры`,
        timestamp: Date.now()
      };
      io.to(code).emit('chatMessage', leaveMsg);
      const msgs = chatMessages.get(code) || [];
      msgs.push(leaveMsg);
      if (msgs.length > 200) msgs.splice(0, msgs.length - 200);
      chatMessages.set(code, msgs);
    }
    
    lobby.game.removePlayer(socket.id);
    lobby.playerIds = lobby.playerIds.filter(id => id !== socket.id);
    
    if (lobby.playerIds.length === 0) {
      lobbies.delete(code);
      chatMessages.delete(code);
      console.log('Лобби удалено:', code);
    } else if (beforeCount === 2 && lobby.playerIds.length === 1) {
      // Если в лобби было ровно 2 игрока и один вышел — второй тоже покидает лобби
      const remainingId = lobby.playerIds[0];
      const remainingSocket = io.sockets.sockets.get(remainingId);
      if (remainingSocket) remainingSocket.leave(code);
      socketToLobby.delete(remainingId);
      io.to(remainingId).emit('lobbyClosed', { message: 'Другой игрок вышел. Лобби закрыто.' });
      lobbies.delete(code);
      chatMessages.delete(code);
      console.log('Лобби закрыто (осталось 1 из 2):', code);
    } else {
      io.to(code).emit('gameStateUpdate', lobby.game.getGameState());
      io.to(code).emit('playerLeft', { message: 'Игрок вышел из игры' });
    }
  });

  function startQuestionTimer(code) {
    const lobby = lobbies.get(code);
    if (!lobby) return;
    const game = lobby.game;
    if (!game || game.gameState !== 'question') return;
    
    game.timeLeft = game.settings.timePerQuestion;
    const timer = setInterval(() => {
      game.timeLeft--;
      io.to(code).emit('timerUpdate', { timeLeft: game.timeLeft });
      
      if (game.timeLeft <= 0) {
        clearInterval(timer);
        game.timer = null;
        game.gameState = 'answer';
        io.to(code).emit('gameStateUpdate', game.getGameState());
      }
    }, 1000);
    game.timer = timer;
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('=================================');
  console.log('🎮 ВИКТОРИНА ЗАПУЩЕНА!');
  console.log('💬 ЧАТ (ОБЩИЙ) ВКЛЮЧЕН');
  console.log('📡 Порт:', PORT);
  console.log('🌐 Откройте: http://localhost:' + PORT);
  console.log('=================================');
});
