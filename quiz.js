const { getQuestionsByDifficulty } = require('./questions');

class QuizGame {
  constructor(settings = {}) {
    this.players = [];
    this.host = null;
    this.gameState = 'waiting';
    this.currentQuestion = 0;
    this.questions = [];
    this.timer = null;
    this.timeLeft = 20;
    this.scores = {};
    this.answers = {};
    this.playerErrors = {}; // Ошибки на текущий вопрос
    this.awardedForQuestion = new Set(); // Игроки, уже получившие очки за текущий вопрос
    
    this.settings = {
      questionCount: 10,
      difficulty: 'medium',
      timePerQuestion: 20,
      maxErrors: 1,
      ...settings
    };
    
    this.initQuestions();
  }

  initQuestions() {
    console.log(`Инициализация вопросов: сложность=${this.settings.difficulty}, количество=${this.settings.questionCount}`);
    this.questions = getQuestionsByDifficulty(
      this.settings.difficulty, 
      this.settings.questionCount
    );
    this.timeLeft = this.settings.timePerQuestion;
  }

  updateSettings(newSettings) {
    console.log('Обновление настроек:', newSettings);
    this.settings = { ...this.settings, ...newSettings };
    this.initQuestions();
    return true;
  }

  addPlayer(playerId, playerName) {
    if (this.players.length >= 8) return false;
    const player = {
      id: playerId,
      name: playerName,
      score: 0,
      isHost: this.players.length === 0,
      errors: 0
    };
    this.players.push(player);
    this.scores[playerId] = 0;
    this.playerErrors[playerId] = 0;
    if (player.isHost) this.host = playerId;
    return true;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
    delete this.scores[playerId];
    delete this.playerErrors[playerId];
    if (playerId === this.host && this.players.length > 0) {
      this.players[0].isHost = true;
      this.host = this.players[0].id;
    }
  }

  startGame() {
    if (this.players.length < 2) return false;
    this.gameState = 'starting';
    this.currentQuestion = 0;
    this.playerErrors = {};
    this.answers = {};
    this.awardedForQuestion.clear();
    this.initQuestions();
    this.players.forEach(player => {
      this.scores[player.id] = 0;
      this.playerErrors[player.id] = 0;
      player.score = 0;
      player.errors = 0;
    });
    this.timeLeft = this.settings.timePerQuestion;
    this.answers = {};
    return true;
  }

  getCurrentQuestion() {
    if (this.currentQuestion >= this.questions.length) return null;
    return this.questions[this.currentQuestion];
  }

  submitAnswer(playerId, answerIndex) {
    const question = this.getCurrentQuestion();
    if (!question) return false;
    
    const isCorrect = answerIndex === question.correctAnswer;
    const maxErrors = this.settings.maxErrors;
    let currentErrors = this.playerErrors[playerId] || 0;
    
    // Если ответ неправильный, увеличиваем счётчик ошибок
    if (!isCorrect) {
      currentErrors++;
      this.playerErrors[playerId] = currentErrors;
    }
    
    const errorsExceeded = currentErrors > maxErrors;
    
    // Начисляем очки, если ответ правильный, ошибок не превышено и очки ещё не начислялись
    if (isCorrect && !errorsExceeded && !this.awardedForQuestion.has(playerId)) {
      const timeBonus = Math.max(0, this.timeLeft);
      const basePoints = this.settings.difficulty === 'easy' ? 50 : 
                        this.settings.difficulty === 'medium' ? 100 : 150;
      const points = basePoints + timeBonus;
      
      this.scores[playerId] += points;
      this.awardedForQuestion.add(playerId);
      
      const player = this.players.find(p => p.id === playerId);
      if (player) player.score = this.scores[playerId];
    }
    
    // Сохраняем ответ (даже если ошибок превышено)
    this.answers[playerId] = {
      answer: answerIndex,
      timestamp: Date.now(),
      isCorrect: isCorrect
    };
    
    return true;
  }

  nextQuestion() {
    this.currentQuestion++;
    this.answers = {};
    this.playerErrors = {};
    this.awardedForQuestion.clear();
    this.timeLeft = this.settings.timePerQuestion;
    
    if (this.currentQuestion >= this.questions.length) {
      this.gameState = 'results';
      return false;
    }
    
    this.gameState = 'question';
    return true;
  }

  getGameState() {
    const currentQuestion = this.getCurrentQuestion();
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score,
        isHost: p.isHost,
        errors: this.playerErrors[p.id] || 0,
        maxErrors: this.settings.maxErrors,
        hasAnswered: this.answers[p.id] !== undefined
      })),
      gameState: this.gameState,
      currentQuestion: currentQuestion ? {
        id: currentQuestion.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        category: currentQuestion.category
      } : null,
      questionNumber: this.currentQuestion + 1,
      totalQuestions: this.questions.length,
      timeLeft: this.timeLeft,
      answers: this.answers,
      scores: this.scores,
      settings: this.settings
    };
  }

  getResults() {
    const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);
    return {
      players: sortedPlayers,
      winner: sortedPlayers[0],
      settings: this.settings
    };
  }
}

module.exports = QuizGame;