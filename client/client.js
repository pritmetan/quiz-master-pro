class QuizGameClient {
  constructor() {
    this.socket = io({ withCredentials: true });
    this.playerId = null;
    this.playerName = '';
    this.gameState = null;
    this.isHost = false;
    this.selectedAnswer = null;
    this.account = null;
    this.guestMode = false;
    this.currentSettings = {
      questionCount: 10,
      difficulty: 'medium',
      timePerQuestion: 20,
      maxErrors: 1
    };

    this.chat = new QuizChat(this.socket, this);

    console.log('Клиент викторины инициализирован с чатом');

    this.initEventListeners();
    this.setupSocketListeners();
    void this.bootstrapApp();
  }

  async bootstrapApp() {
    await this.loadSession();
    document.getElementById('loadingOverlay')?.classList.add('hidden');
  }

  async loadSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      if (data?.user) {
        this.account = data.user;
        this.guestMode = false;
        await this.reconnectSocket();
        this.showMainApp();
      } else {
        this.account = null;
        this.showAuthScreen();
      }
    } catch {
      this.account = null;
      this.showAuthScreen();
    }
    this.applyLobbyNicknameMode();
    this.refreshAuthNavVisibility();
  }

  /** После входа cookie обновляется, но WebSocket нужно переподключить, иначе userDbId на сервере = null */
  reconnectSocket() {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.socket.off('connect', onConnect);
        this.socket.emit('syncAuth');
        resolve();
      };
      const onConnect = () => finish();
      const timer = setTimeout(finish, 8000);
      if (this.socket.connected) {
        this.socket.once('connect', onConnect);
        this.socket.disconnect();
      } else {
        this.socket.once('connect', onConnect);
        this.socket.connect();
      }
    });
  }

  showAuthScreen() {
    document.getElementById('authScreen')?.classList.remove('hidden');
    document.getElementById('lobbyScreen')?.classList.add('hidden');
    document.getElementById('gameScreen')?.classList.add('hidden');
    document.getElementById('resultsScreen')?.classList.add('hidden');
    this.refreshAuthNavVisibility();
  }

  showMainApp() {
    document.getElementById('authScreen')?.classList.add('hidden');
    document.getElementById('lobbyScreen')?.classList.remove('hidden');
    document.getElementById('gameScreen')?.classList.add('hidden');
    document.getElementById('resultsScreen')?.classList.add('hidden');
    this.refreshAuthNavVisibility();
  }

  enterGuestMode() {
    this.account = null;
    this.guestMode = true;
    this.showMainApp();
    this.applyLobbyNicknameMode();
    this.refreshAuthNavVisibility();
  }

  applyLobbyNicknameMode() {
    const locked = !!this.account && !this.guestMode;
    const nick = locked ? (this.account.displayName || this.account.login || '').trim() : '';
    ['Create', 'Join'].forEach((side) => {
      const inp = document.getElementById(`playerName${side}`);
      const hint = document.getElementById(`nicknameLockHint${side}`);
      if (!inp) return;
      if (locked) {
        inp.readOnly = true;
        inp.classList.add('form-input-readonly');
        inp.value = nick;
        inp.placeholder = 'Ник из профиля';
        inp.setAttribute('tabindex', '-1');
        hint?.classList.remove('hidden');
      } else {
        inp.readOnly = false;
        inp.classList.remove('form-input-readonly');
        inp.placeholder = 'Ваше имя';
        inp.removeAttribute('tabindex');
        hint?.classList.add('hidden');
      }
    });
  }

  getInGameDisplayName(isCreate) {
    if (this.account && !this.guestMode) {
      return (this.account.displayName || this.account.login || '').trim();
    }
    const id = isCreate ? 'playerNameCreate' : 'playerNameJoin';
    return document.getElementById(id).value.trim();
  }

  refreshAuthNavVisibility() {
    const btn = document.getElementById('switchToAuthBtn');
    if (!btn) return;
    const waiting = document.getElementById('waitingRoom');
    const inWaiting = waiting && !waiting.classList.contains('hidden');
    const onAuth = document.getElementById('authScreen') && !document.getElementById('authScreen').classList.contains('hidden');
    const show = this.guestMode && !inWaiting && !onAuth;
    btn.classList.toggle('hidden', !show);
  }

  showAuthTab(which) {
    const loginTab = document.getElementById('authTabLogin');
    const regTab = document.getElementById('authTabRegister');
    const loginBlock = document.getElementById('authLoginBlock');
    const regBlock = document.getElementById('authRegisterBlock');
    const msg = document.getElementById('authFormMessage');
    msg?.classList.add('hidden');
    if (which === 'login') {
      loginTab?.classList.add('active');
      regTab?.classList.remove('active');
      loginBlock?.classList.remove('hidden');
      regBlock?.classList.add('hidden');
    } else {
      regTab?.classList.add('active');
      loginTab?.classList.remove('active');
      regBlock?.classList.remove('hidden');
      loginBlock?.classList.add('hidden');
    }
  }

  setAuthFormMessage(text, isError) {
    const el = document.getElementById('authFormMessage');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
    el.classList.toggle('auth-inline-message-error', !!isError);
    el.classList.toggle('auth-inline-message-ok', !isError);
  }

  async submitAuthRegister() {
    const login = document.getElementById('authRegUser')?.value.trim() || '';
    const p1 = document.getElementById('authRegPass')?.value || '';
    const p2 = document.getElementById('authRegPass2')?.value || '';
    if (p1 !== p2) {
      this.setAuthFormMessage('Пароли не совпадают', true);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ login, password: p1 })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
      this.setAuthFormMessage(data.message || 'Регистрация успешна. Войдите.', false);
      this.showAuthTab('login');
      document.getElementById('authLoginUser').value = login;
      document.getElementById('authRegPass').value = '';
      document.getElementById('authRegPass2').value = '';
    } catch (e) {
      this.setAuthFormMessage(e.message, true);
    }
  }

  async submitAuthLogin() {
    const login = document.getElementById('authLoginUser')?.value.trim() || '';
    const password = document.getElementById('authLoginPass')?.value || '';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ login, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Ошибка входа');
      this.account = data.user;
      this.guestMode = false;
      await this.reconnectSocket();
      this.showMainApp();
      this.applyLobbyNicknameMode();
      this.renderProfilePanel();
      this.refreshAuthNavVisibility();
      document.getElementById('authLoginPass').value = '';
    } catch (e) {
      this.setAuthFormMessage(e.message, true);
    }
  }

  toggleProfilePanel() {
    const c = document.getElementById('profileContainer');
    const m = document.getElementById('profileMinimized');
    const btn = document.getElementById('toggleProfileBtn');
    if (!c) return;
    const opening = c.classList.contains('hidden');
    c.classList.toggle('hidden', !opening);
    if (opening) {
      m?.classList.add('hidden');
      btn?.classList.add('hidden');
      this.renderProfilePanel();
    } else {
      btn?.classList.remove('hidden');
    }
  }

  closeProfilePanel() {
    document.getElementById('profileContainer')?.classList.add('hidden');
    document.getElementById('profileMinimized')?.classList.add('hidden');
    document.getElementById('toggleProfileBtn')?.classList.remove('hidden');
  }

  minimizeProfilePanel() {
    document.getElementById('profileContainer')?.classList.add('hidden');
    document.getElementById('profileMinimized')?.classList.remove('hidden');
    document.getElementById('toggleProfileBtn')?.classList.add('hidden');
  }

  restoreProfilePanel() {
    document.getElementById('profileMinimized')?.classList.add('hidden');
    document.getElementById('profileContainer')?.classList.remove('hidden');
    this.renderProfilePanel();
  }

  async renderProfilePanel() {
    const guestHint = document.getElementById('profileGuestHint');
    const accBlock = document.getElementById('profileAccountBlock');
    if (!guestHint || !accBlock) return;

    if (!this.account || this.guestMode) {
      guestHint.classList.remove('hidden');
      accBlock.classList.add('hidden');
      return;
    }

    guestHint.classList.add('hidden');
    accBlock.classList.remove('hidden');

    document.getElementById('profileLoginDisplay').textContent = this.account.login;
    const inp = document.getElementById('profileDisplayNameInput');
    if (inp) inp.value = this.account.displayName || this.account.login || '';

    const st = this.account.stats || {};
    document.getElementById('statGames').textContent = st.gamesPlayed ?? 0;
    document.getElementById('statWins').textContent = st.gamesWon ?? 0;
    document.getElementById('statScore').textContent = st.totalScore ?? 0;

    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      if (data?.user) {
        this.account = data.user;
        document.getElementById('statGames').textContent = data.user.stats?.gamesPlayed ?? 0;
        document.getElementById('statWins').textContent = data.user.stats?.gamesWon ?? 0;
        document.getElementById('statScore').textContent = data.user.stats?.totalScore ?? 0;
        if (inp) inp.value = data.user.displayName || data.user.login || '';
      }
    } catch (_) {}
  }

  async saveProfileNickname() {
    if (!this.account || this.guestMode) return;
    const displayName = document.getElementById('profileDisplayNameInput')?.value.trim() || '';
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ displayName })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Не удалось сохранить');
      this.account = data.user;
      this.applyLobbyNicknameMode();
      this.showMessage('✅', 'Ник сохранён. В текущей комнате имя не меняется — только в новой сессии.');
      setTimeout(() => this.closeMessage(), 2500);
    } catch (e) {
      this.showMessage('❌', e.message);
    }
  }

  logoutAccount() {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).finally(() => {
      window.location.reload();
    });
  }

  initEventListeners() {
    document.getElementById('tabCreate').addEventListener('click', () => this.showLobbyTab('create'));
    document.getElementById('tabJoin').addEventListener('click', () => this.showLobbyTab('join'));

    document.getElementById('authTabLogin')?.addEventListener('click', () => this.showAuthTab('login'));
    document.getElementById('authTabRegister')?.addEventListener('click', () => this.showAuthTab('register'));
    document.getElementById('authLoginSubmit')?.addEventListener('click', () => this.submitAuthLogin());
    document.getElementById('authRegisterSubmit')?.addEventListener('click', () => this.submitAuthRegister());
    document.getElementById('authGuestBtn')?.addEventListener('click', () => this.enterGuestMode());
    document.getElementById('switchToAuthBtn')?.addEventListener('click', () => {
      if (this.playerId) {
        this.showMessage('⚠️', 'Сначала выйдите из комнаты (закройте вкладку или дождитесь окончания игры).');
        return;
      }
      this.showAuthScreen();
    });

    document.getElementById('toggleProfileBtn')?.addEventListener('click', () => this.toggleProfilePanel());
    document.getElementById('profileCloseBtn')?.addEventListener('click', () => this.closeProfilePanel());
    document.getElementById('profileMinimizeBtn')?.addEventListener('click', () => this.minimizeProfilePanel());
    document.getElementById('profileRestoreBtn')?.addEventListener('click', () => this.restoreProfilePanel());
    document.getElementById('profileSaveNicknameBtn')?.addEventListener('click', () => this.saveProfileNickname());
    document.getElementById('profileLogoutBtn')?.addEventListener('click', () => this.logoutAccount());

    document.getElementById('createLobbyBtn').addEventListener('click', () => this.createLobby());
    document.getElementById('joinLobbyBtn').addEventListener('click', () => this.joinLobby());
    document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
    
    document.querySelectorAll('.setting-range').forEach(range => {
      range.addEventListener('input', (e) => {
        const value = e.target.value;
        const display = e.target.nextElementSibling;
        if (display) {
          if (e.target.id === 'settingTime') {
            display.textContent = `${value} сек`;
          } else {
            display.textContent = value;
          }
        }
      });
    });

    document.getElementById('playerNameCreate').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createLobby();
    });
    document.getElementById('playerNameJoin').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.joinLobby();
    });
    document.getElementById('lobbyCodeInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.joinLobby();
    });

    document.getElementById('nextQuestionBtn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('backToLobbyBtn').addEventListener('click', () => this.backToLobby());
    document.getElementById('closeMessageBtn').addEventListener('click', () => this.closeMessage());
  }

  setupSocketListeners() {
    this.socket.on('lobbyCreated', (data) => {
      this.playerId = data.playerId;
      this.playerName = this.getInGameDisplayName(true);
      this.isHost = true;
      this.showWaitingRoom(data.code);
      this.showSettingsPanel();
      this.chat.setPlayerData(this.playerId, this.playerName);
      this.chat.setLobby(data.code);
    });

    this.socket.on('gameJoined', (data) => {
      this.playerId = data.playerId;
      this.playerName = this.getInGameDisplayName(false);
      this.isHost = false;
      this.showWaitingRoom();
      this.chat.setPlayerData(this.playerId, this.playerName);
      this.chat.setLobby(document.getElementById('lobbyCodeInput').value.trim().toUpperCase());
    });

    this.socket.on('gameStateUpdate', (gameState) => {
      this.gameState = gameState;
      this.updateGameUI();
    });

    this.socket.on('settingsUpdated', (settings) => {
      console.log('Настройки обновлены сервером:', settings);
      this.currentSettings = settings;
      this.updateSettingsDisplay(settings);
      this.showMessage('✅', 'Настройки успешно сохранены');
      setTimeout(() => this.closeMessage(), 2000);
    });

    this.socket.on('gameStarted', () => {
      this.showMessage('🎮', 'Игра начинается!');
      setTimeout(() => this.closeMessage(), 2000);
    });

    this.socket.on('answerSubmitted', (data) => {
      const remaining = Math.max(0, (data.maxErrors ?? 0) - (data.errors ?? 0));
      const attemptsExhausted = !data.isCorrect && (data.errors ?? 0) >= (data.maxErrors ?? 0);

      if (attemptsExhausted) {
        this.showMessage('⚠️', `Вы исчерпали лимит ошибок на этот вопрос!`);
        this.disableOptions(true);
      } else if (data.isCorrect) {
        this.showMessage('✅', 'Правильно!');
        this.disableOptions(true);
      } else {
        this.showMessage('❌', `Ошибка! Осталось попыток: ${remaining}`);
        // Не блокируем кнопки, можно пробовать снова
      }
      setTimeout(() => this.closeMessage(), 2000);
    });

    this.socket.on('timerUpdate', (data) => {
      const timerElement = document.getElementById('gameTimer');
      if (timerElement) {
        timerElement.textContent = data.timeLeft;
        timerElement.style.color = data.timeLeft <= 10 ? '#fd79a8' : '';
      }
    });

    this.socket.on('gameFinished', (results) => {
      this.showResults(results);
      void this.reloadAccountStats();
    });

    this.socket.on('playerLeft', (data) => {
      this.showMessage('👋', data.message);
    });

    this.socket.on('lobbyError', (data) => {
      this.showMessage('❌', data.message);
    });

    this.socket.on('lobbyClosed', (data) => {
      this.showMessage('👋', data?.message || 'Лобби закрыто');
      this.leaveLobbyToMain();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Ошибка подключения:', error);
      this.showMessage('🔌', 'Ошибка подключения к серверу');
    });
  }

  showLobbyTab(tab) {
    const root = document.getElementById('lobbyChoice');
    const createBlock = document.getElementById('createLobbyBlock');
    const joinBlock = document.getElementById('joinLobbyBlock');
    if (!root || !createBlock || !joinBlock) return;
    root.querySelectorAll('.lobby-tab').forEach((t) => t.classList.remove('active'));

    if (tab === 'create') {
      createBlock.classList.remove('hidden');
      joinBlock.classList.add('hidden');
      document.getElementById('tabCreate').classList.add('active');
      document.getElementById('playerNameCreate').focus();
    } else {
      joinBlock.classList.remove('hidden');
      createBlock.classList.add('hidden');
      document.getElementById('tabJoin').classList.add('active');
      document.getElementById('playerNameJoin').focus();
    }
  }

  createLobby() {
    const name = this.getInGameDisplayName(true);
    if (!name) {
      this.showMessage('⚠️', this.account && !this.guestMode ? 'Задайте ник в профиле' : 'Введите ваше имя');
      return;
    }
    this.playerName = name;
    this.socket.emit('createLobby', name);
  }

  joinLobby() {
    const name = this.getInGameDisplayName(false);
    const code = document.getElementById('lobbyCodeInput').value.trim().toUpperCase();

    if (!name) {
      this.showMessage('⚠️', this.account && !this.guestMode ? 'Задайте ник в профиле' : 'Введите ваше имя');
      return;
    }
    if (!code || code.length !== 6) {
      this.showMessage('⚠️', 'Введите код из 6 символов');
      return;
    }

    this.playerName = name;
    this.socket.emit('joinLobby', { playerName: name, lobbyCode: code });
  }

  saveSettings() {
    const settings = {
      questionCount: parseInt(document.getElementById('settingQuestionCount').value),
      difficulty: document.getElementById('settingDifficulty').value,
      timePerQuestion: parseInt(document.getElementById('settingTime').value),
      maxErrors: parseInt(document.getElementById('settingErrors').value)
    };
    this.socket.emit('updateSettings', settings);
  }

  updateSettingsDisplay(settings) {
    if (!settings) return;
    document.getElementById('settingQuestionCount').value = settings.questionCount;
    document.getElementById('settingQuestionCountValue').textContent = settings.questionCount;
    document.getElementById('settingDifficulty').value = settings.difficulty;
    document.getElementById('settingTime').value = settings.timePerQuestion;
    document.getElementById('settingTimeValue').textContent = `${settings.timePerQuestion} сек`;
    document.getElementById('settingErrors').value = settings.maxErrors;
    document.getElementById('settingErrorsValue').textContent = settings.maxErrors;
    
    const diffDisplay = document.getElementById('difficultyDisplay');
    if (diffDisplay) {
      diffDisplay.className = `difficulty-badge difficulty-${settings.difficulty}`;
      diffDisplay.textContent = 
        settings.difficulty === 'easy' ? 'Легкая' :
        settings.difficulty === 'medium' ? 'Средняя' : 'Сложная';
    }
  }

  startGame() {
    this.socket.emit('startGame');
  }

  submitAnswer(answerIndex) {
    // Отправляем ответ на сервер (разрешено повторно)
    this.socket.emit('submitAnswer', answerIndex);
    
    // Визуально выделяем выбранный ответ
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, idx) => {
      if (idx === answerIndex) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    this.selectedAnswer = answerIndex;
  }

  disableOptions(disable) {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = disable;
    });
  }

  nextQuestion() {
    this.selectedAnswer = null;
    this.socket.emit('nextQuestion');
  }

  backToLobby() {
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById('lobbyScreen').classList.remove('hidden');
    document.getElementById('waitingRoom').classList.remove('hidden');
    this.selectedAnswer = null;
    this.refreshAuthNavVisibility();
  }

  leaveLobbyToMain() {
    // Полный выход в стартовый экран выбора "создать/войти"
    this.playerId = null;
    this.isHost = false;
    this.gameState = null;
    this.selectedAnswer = null;

    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById('lobbyScreen').classList.remove('hidden');

    document.getElementById('waitingRoom').classList.add('hidden');
    document.getElementById('lobbyChoice').classList.remove('hidden');

    const playersList = document.getElementById('playersList');
    if (playersList) playersList.innerHTML = '';
    const lobbyCodeDisplay = document.getElementById('lobbyCodeDisplay');
    if (lobbyCodeDisplay) lobbyCodeDisplay.textContent = '';
    const playersCount = document.getElementById('playersCount');
    if (playersCount) playersCount.textContent = '0';

    this.disableOptions(false);
    this.chat?.leaveLobby?.();
    this.refreshAuthNavVisibility();
  }

  showWaitingRoom(code = null) {
    document.getElementById('lobbyChoice').classList.add('hidden');
    document.getElementById('waitingRoom').classList.remove('hidden');
    
    if (code) document.getElementById('lobbyCodeDisplay').textContent = code;
    
    if (this.isHost) {
      document.getElementById('hostControls').classList.remove('hidden');
      document.getElementById('gameSettings').classList.remove('hidden');
    }

    this.refreshAuthNavVisibility();
  }

  showSettingsPanel() {
    const panel = document.getElementById('gameSettings');
    if (panel) {
      panel.classList.remove('hidden');
      this.updateSettingsDisplay(this.currentSettings);
    }
  }

  updateGameUI() {
    if (!this.gameState) return;
    const state = this.gameState.gameState;
    
    if (state === 'waiting' || state === 'settings') {
      this.updateWaitingRoom();
    } else if (state === 'starting' || state === 'question' || state === 'answer' || state === 'results') {
      this.showGameScreen();
      // Чат не скрывается и не открывается автоматически
    }
  }

  updateWaitingRoom() {
    if (!this.gameState) return;
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    this.gameState.players.forEach(player => {
      const item = document.createElement('div');
      item.className = 'player-score-item';
      item.innerHTML = player.isHost ?
        `<div class="player-name"><i class="fas fa-crown"></i> ${player.name}</div><div class="player-score">${player.score}</div>` :
        `<div class="player-name">${player.name}</div><div class="player-score">${player.score}</div>`;
      playersList.appendChild(item);
    });
    document.getElementById('playersCount').textContent = this.gameState.players.length;
    if (this.isHost) {
      document.getElementById('startGameBtn').disabled = this.gameState.players.length < 2;
    }
    if (this.gameState.settings) this.updateSettingsDisplay(this.gameState.settings);
  }

  showGameScreen() {
    document.getElementById('lobbyScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('resultsScreen').classList.add('hidden');
    this.updateGameInterface();
    // Чат не открывается автоматически
  }

  updateGameInterface() {
    if (!this.gameState) return;
    document.getElementById('questionCounter').textContent = 
      `${this.gameState.questionNumber}/${this.gameState.totalQuestions}`;
    document.getElementById('playersCount').textContent = this.gameState.players.length;
    
    const currentPlayer = this.gameState.players.find(p => p.id === this.playerId);
    if (currentPlayer) {
      document.getElementById('playerScore').textContent = currentPlayer.score;
      document.getElementById('playerErrors').textContent = 
        `${currentPlayer.errors}/${currentPlayer.maxErrors}`;
    }
    
    const progress = (this.gameState.questionNumber / this.gameState.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentQuestionNum').textContent = this.gameState.questionNumber;
    document.getElementById('totalQuestions').textContent = this.gameState.totalQuestions;
    
    this.updatePlayersPanel();
    
    if (this.gameState.gameState === 'question') {
      this.showQuestion();
    } else if (this.gameState.gameState === 'answer') {
      this.showAnswer();
    }
  }

  updatePlayersPanel() {
    const panel = document.getElementById('playersPanel');
    if (!panel) return;
    panel.innerHTML = '';
    this.gameState.players.forEach(player => {
      const el = document.createElement('div');
      el.className = 'player-score-item';
      if (player.id === this.playerId) el.classList.add('current-player');
      if (player.isHost) el.classList.add('host');
      const errorsHtml = Array.from({length: player.maxErrors}, (_, i) => 
        `<div class="error-dot ${i < (player.errors || 0) ? 'active' : ''}"></div>`
      ).join('');
      el.innerHTML = `
        <div>
          <div>${player.name}</div>
          <div class="player-errors">${errorsHtml}</div>
        </div>
        <div class="player-score">${player.score}</div>
      `;
      panel.appendChild(el);
    });
  }

  showQuestion() {
    if (!this.gameState.currentQuestion) return;
    const q = this.gameState.currentQuestion;
    document.getElementById('questionCategory').textContent = q.category;
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('answerResult').classList.add('hidden');
    document.getElementById('hostGameControls').classList.add('hidden');
    
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => {
        if (!btn.disabled) {
          this.submitAnswer(idx);
        }
      });
      container.appendChild(btn);
    });
    
    // Если уже был ответ на этот вопрос (например, после перезагрузки), выделим его
    const prevAnswer = this.gameState.answers[this.playerId];
    if (prevAnswer) {
      const btns = document.querySelectorAll('.option-btn');
      btns[prevAnswer.answer]?.classList.add('selected');
      const player = this.gameState.players.find(p => p.id === this.playerId);
      // Блокируем, если попытки исчерпаны (и уже есть хотя бы одна ошибка)
      if (player && (player.errors >= player.maxErrors) && player.errors > 0) {
        this.disableOptions(true);
      }
    }
  }

  showAnswer() {
    if (!this.gameState.currentQuestion) return;
    const q = this.gameState.currentQuestion;
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, idx) => {
      if (idx === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (this.selectedAnswer === idx && idx !== q.correctAnswer) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });
    
    const resultDiv = document.getElementById('answerResult');
    resultDiv.classList.remove('hidden');
    const playerAnswer = this.gameState.answers[this.playerId];
    const isCorrect = playerAnswer ? playerAnswer.isCorrect : false;
    document.getElementById('resultText').textContent = isCorrect ? '✅ Правильно!' : '❌ Неправильно';

    const correctAnswerEl = document.getElementById('correctAnswer');
    if (correctAnswerEl && Array.isArray(q.options) && typeof q.correctAnswer === 'number') {
      correctAnswerEl.textContent = `Правильный ответ: ${q.options[q.correctAnswer] ?? ''}`;
    }

    const explanationEl = document.getElementById('explanationText');
    if (explanationEl) {
      if (q.explanation) {
        explanationEl.textContent = q.explanation;
        explanationEl.classList.remove('hidden');
      } else {
        explanationEl.textContent = '';
        explanationEl.classList.add('hidden');
      }
    }
    
    if (this.isHost) {
      document.getElementById('hostGameControls').classList.remove('hidden');
    }
  }

  showResults(results) {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    document.getElementById('winnerName').textContent = results.winner.name;
    document.getElementById('winnerScore').textContent = `${results.winner.score} очков`;
    this.updateGameStats(results);
    this.updatePodium(results);
    this.updateOtherPlayers(results);
  }

  updateGameStats(results) {
    const statsDiv = document.getElementById('gameStats');
    if (!statsDiv) return;
    const settings = results.settings || this.currentSettings;
    const total = settings.questionCount || 10;
    const avg = Math.round(results.players.reduce((s, p) => s + p.score, 0) / results.players.length);
    statsDiv.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item"><div class="stat-value">${total}</div><div>Вопросов</div></div>
        <div class="stat-item"><div class="stat-value">${avg}</div><div>Средний счет</div></div>
        <div class="stat-item"><div class="stat-value">${settings.timePerQuestion || 20}</div><div>Секунд на ответ</div></div>
        <div class="stat-item"><div class="stat-value difficulty-badge difficulty-${settings.difficulty || 'medium'}">${settings.difficulty === 'easy' ? 'Легко' : settings.difficulty === 'medium' ? 'Средне' : 'Сложно'}</div><div>Сложность</div></div>
      </div>
    `;
  }

  updatePodium(results) {
    const podium = document.querySelector('.podium');
    if (!podium) return;
    podium.innerHTML = '';
    results.players.slice(0, 3).forEach((player, idx) => {
      const place = ['first', 'second', 'third'][idx];
      const medal = ['🥇', '🥈', '🥉'][idx];
      const div = document.createElement('div');
      div.className = `podium-platform ${place}`;
      div.innerHTML = `<div style="font-size:2rem;">${medal}</div><div>${player.name}</div><div style="font-weight:bold;">${player.score}</div>`;
      podium.appendChild(div);
    });
  }

  updateOtherPlayers(results) {
    const container = document.querySelector('.other-players .players-grid');
    if (!container || results.players.length <= 3) return;
    container.innerHTML = '';
    results.players.slice(3).forEach((player, i) => {
      const div = document.createElement('div');
      div.className = 'other-player';
      div.innerHTML = `<div>${i+4}. ${player.name}</div><div>${player.score}</div>`;
      container.appendChild(div);
    });
  }

  showMessage(icon, text) {
    const overlay = document.getElementById('messageOverlay');
    const iconEl = document.getElementById('messageIcon');
    const textEl = document.getElementById('messageText');
    if (iconEl && textEl && overlay) {
      iconEl.textContent = icon;
      textEl.textContent = text;
      overlay.classList.remove('hidden');
    }
  }

  closeMessage() {
    document.getElementById('messageOverlay')?.classList.add('hidden');
  }

  async reloadAccountStats() {
    if (!this.account || this.guestMode) return;
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      if (data?.user) this.account = data.user;
    } catch (_) {}
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  window.gameClient = new QuizGameClient();
});
