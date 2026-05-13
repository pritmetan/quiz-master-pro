* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:root {
    --primary: #6c5ce7;
    --primary-dark: #5b4bdb;
    --secondary: #00cec9;
    --accent: #fd79a8;
    --success: #00b894;
    --warning: #fdcb6e;
    --danger: #e17055;
    --dark: #2d3436;
    --light: #f9f9f9;
}

body {
    background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
}

/* Класс для скрытия элементов */
.hidden {
    display: none !important;
}

/* Анимации */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.3s ease-out;
}

/* Лоадер */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a237e, #4a148c);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.quiz-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid var(--secondary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Основной контейнер */
.game-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
}

/* ЭКРАН ЛОББИ */
.lobby-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
}

.lobby-wrapper {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 600px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.game-title {
    text-align: center;
    margin-bottom: 30px;
}

.game-title h1 {
    font-size: 2.5rem;
    color: var(--secondary);
    margin-bottom: 10px;
}

.game-title p {
    color: rgba(255, 255, 255, 0.7);
}

/* Вкладки */
.lobby-tabs {
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 30px;
}

.lobby-tab {
    flex: 1;
    padding: 15px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
}

.lobby-tab.active {
    background: var(--primary);
    color: white;
}

/* Формы */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-input {
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
}

.form-input:focus {
    outline: none;
    border-color: var(--secondary);
}

/* Кнопки */
.btn {
    padding: 15px 25px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.btn:hover {
    transform: translateY(-2px);
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-success {
    background: var(--success);
    color: white;
}

/* Окно ожидания */
.waiting-room {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 30px;
    margin-top: 30px;
}

.code-display {
    background: var(--primary);
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
}

.code-display .code {
    font-family: monospace;
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    letter-spacing: 5px;
}

/* Настройки игры */
.game-settings {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 25px;
    margin-top: 25px;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.setting-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
}

.setting-label {
    display: block;
    margin-bottom: 10px;
    color: var(--secondary);
    font-weight: 600;
}

.setting-select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.setting-range {
    width: 100%;
    margin: 10px 0;
}

.setting-value {
    display: block;
    text-align: center;
    font-weight: bold;
    color: var(--secondary);
}

/* ИГРОВОЙ ЭКРАН */
.game-screen {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 100vh;
}

/* Хедер игры */
.game-header {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

.game-info {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.info-item {
    text-align: center;
}

.info-label {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.info-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--secondary);
}

.timer {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent);
}

/* Основное поле игры */
.game-main {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
}

@media (max-width: 900px) {
    .game-main {
        grid-template-columns: 1fr;
    }
}

/* Панель игроков */
.players-panel {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 20px;
    height: fit-content;
}

.player-score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 8px;
}

.player-score-item.current-player {
    border: 2px solid var(--secondary);
}

.player-score-item.host {
    background: rgba(253, 203, 110, 0.1);
}

.player-score {
    background: var(--primary);
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
}

/* Область вопроса */
.question-area {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 30px;
}

.question-category {
    display: inline-block;
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.question-text {
    font-size: 1.8rem;
    margin: 25px 0;
    line-height: 1.4;
}

.question-progress {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--secondary);
    border-radius: 3px;
    transition: width 0.3s;
}

/* Варианты ответов */
.options-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
    margin: 30px 0;
}

.option-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 15px;
}

.option-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--secondary);
}

.option-btn.selected {
    background: rgba(0, 206, 201, 0.2);
    border-color: var(--secondary);
}

.option-btn.correct {
    background: rgba(0, 184, 148, 0.2);
    border-color: var(--success);
}

.option-btn.incorrect {
    background: rgba(225, 112, 85, 0.2);
    border-color: var(--danger);
}

.option-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.option-letter {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    border-radius: 50%;
    font-weight: bold;
    flex-shrink: 0;
}

/* Кнопки действия */
.game-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

/* Результаты вопроса */
.answer-result {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 25px;
    margin-top: 25px;
    text-align: center;
}

#resultText {
    font-size: 1.5rem;
    margin-bottom: 15px;
    font-weight: bold;
}

/* ЭКРАН РЕЗУЛЬТАТОВ */
.results-screen {
    padding: 40px 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.winner-section {
    text-align: center;
    margin-bottom: 40px;
}

.winner-badge {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #ffd700, #ff9800);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    font-size: 3rem;
}

.winner-info {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    margin: 0 auto;
}

.winner-name {
    font-size: 2rem;
    font-weight: bold;
    color: #ffd700;
    margin-bottom: 15px;
}

.winner-score {
    font-size: 1.8rem;
    color: var(--secondary);
}

/* Подиум */
.podium-section {
    margin-bottom: 40px;
}

.podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 20px;
    height: 200px;
    margin: 30px 0;
}

.podium-platform {
    width: 150px;
    border-radius: 10px 10px 0 0;
    padding: 20px;
    text-align: center;
    position: relative;
}

.podium-platform.first {
    height: 180px;
    background: linear-gradient(135deg, #ffd700, #ff9800);
}

.podium-platform.second {
    height: 150px;
    background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
}

.podium-platform.third {
    height: 120px;
    background: linear-gradient(135deg, #cd7f32, #a0522d);
}

/* Статистика игры */
.game-stats {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 25px;
    margin: 30px 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--secondary);
    margin-bottom: 5px;
}

/* Остальные игроки */
.other-players {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 25px;
    margin: 30px 0;
}

.players-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
}

.other-player {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

/* Сообщения */
.message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.message-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.message-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.message-text {
    font-size: 1.3rem;
    margin-bottom: 25px;
}

/* Индикаторы сложности */
.difficulty-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.difficulty-easy {
    background: rgba(0, 184, 148, 0.2);
    color: var(--success);
}

.difficulty-medium {
    background: rgba(253, 203, 110, 0.2);
    color: var(--warning);
}

.difficulty-hard {
    background: rgba(225, 112, 85, 0.2);
    color: var(--danger);
}

/* Индикатор ошибок */
.player-errors {
    display: flex;
    gap: 3px;
}

.error-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
}

.error-dot.active {
    background: var(--danger);
}

/* Адаптивность */
@media (max-width: 768px) {
    .lobby-wrapper {
        padding: 25px 20px;
    }
    
    .game-title h1 {
        font-size: 2rem;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .game-header {
        flex-direction: column;
        text-align: center;
    }
    
    .game-info {
        justify-content: center;
    }
    
    .question-text {
        font-size: 1.4rem;
    }
    
    .options-container {
        grid-template-columns: 1fr;
    }
    
    .podium {
        flex-direction: column;
        height: auto;
        align-items: center;
        gap: 15px;
    }
    
    .podium-platform {
        width: 80%;
        max-width: 250px;
        height: auto !important;
        padding: 15px;
    }
}

@media (max-width: 480px) {
    .game-container {
        padding: 10px;
    }
    
    .btn {
        padding: 12px 20px;
        font-size: 0.9rem;
    }
    
    .code-display .code {
        font-size: 2rem;
        letter-spacing: 3px;
    }
}
/* Оптимизированные стили с сохранением градиента */

/* ... существующие стили остаются без изменений до конца файла ... */

/* СТИЛИ ЧАТА */
.chat-toggle-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
}

.chat-toggle-btn:hover {
    background: var(--primary-dark);
    transform: scale(1.1);
}

.chat-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--danger);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Чат контейнер */
.chat-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100vh;
    background: rgba(30, 30, 40, 0.95);
    backdrop-filter: blur(10px);
    border-left: 2px solid var(--primary);
    z-index: 999;
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

.chat-header {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h3 {
    color: var(--secondary);
    font-size: 1.1rem;
    margin: 0;
}

.chat-actions {
    display: flex;
    gap: 10px;
}

.chat-action-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.chat-action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

/* Управление чатом */
.chat-controls {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-recipient-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.chat-recipient-selector label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.chat-recipient-select {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.9rem;
}

.chat-recipient-select:focus {
    outline: none;
    border-color: var(--secondary);
}

.connection-status {
    display: flex;
    justify-content: center;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-connected {
    background: rgba(0, 184, 148, 0.2);
    color: var(--success);
}

.status-disconnected {
    background: rgba(225, 112, 85, 0.2);
    color: var(--danger);
}

.status-reconnecting {
    background: rgba(253, 203, 110, 0.2);
    color: var(--warning);
}

/* Сообщения чата */
.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.chat-message {
    max-width: 85%;
    padding: 12px 15px;
    border-radius: 15px;
    position: relative;
    animation: slideIn 0.3s ease-out;
}

.chat-message.sent {
    align-self: flex-end;
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 5px;
}

.chat-message.received {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-bottom-left-radius: 5px;
}

.chat-message.private {
    border: 1px solid var(--accent);
}

.chat-message.system {
    align-self: center;
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
    max-width: 95%;
    text-align: center;
}

.system-message {
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.7);
    padding: 12px 15px;
    border-radius: 10px;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 10px;
    border-left: 3px solid var(--secondary);
}

.message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 0.8rem;
}

.message-sender {
    font-weight: bold;
    color: var(--secondary);
}

.message-recipient {
    font-size: 0.7rem;
    opacity: 0.8;
}

.message-recipient.private {
    color: var(--accent);
}

.message-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.7rem;
}

.message-content {
    word-wrap: break-word;
    line-height: 1.4;
}

.message-content a {
    color: var(--secondary);
    text-decoration: underline;
}

/* Поле ввода */
.chat-input-area {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input-wrapper {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
}

.chat-input {
    flex: 1;
    padding: 12px 15px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.95rem;
}

.chat-input:focus {
    outline: none;
    border-color: var(--secondary);
}

.chat-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.chat-send-btn {
    width: 50px;
    border-radius: 8px;
    background: var(--secondary);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.chat-send-btn:hover:not(:disabled) {
    background: #00b5b5;
}

.chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.chat-input-hint {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    text-align: center;
}

/* Свернутый чат */
.chat-minimized {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 120px;
    height: 50px;
    background: var(--primary);
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    z-index: 998;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s;
}

.chat-minimized:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
}

.chat-minimized-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    font-size: 0.9rem;
}

.chat-restore-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-minimized-notification {
    background: var(--danger);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

/* Анимации для чата */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.chat-notification {
    animation: pulse 0.5s ease-in-out;
}

/* Адаптивность чата */
@media (max-width: 768px) {
    .chat-container {
        width: 100%;
        right: -100%;
    }
    
    .chat-container.show {
        right: 0;
    }
    
    .chat-toggle-btn {
        top: 10px;
        right: 10px;
        width: 50px;
        height: 50px;
    }
    
    .chat-minimized {
        width: 100px;
        height: 40px;
        top: 10px;
        right: 10px;
    }
}

/* Стили для полосы прокрутки в чате */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

/* --- Страница входа / регистрации --- */
.auth-body {
    min-height: 100vh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.auth-wrap {
    width: 100%;
    max-width: 440px;
    padding: 24px;
}

.auth-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.auth-title {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
}

.auth-sub {
    margin: 0 0 1.5rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
}

.auth-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 1rem;
}

.auth-tab {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-size: 0.95rem;
}

.auth-tab.active {
    background: var(--primary);
    color: #fff;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.auth-label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.85rem;
}

.auth-input {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    font-size: 1rem;
}

.auth-input:focus {
    outline: none;
    border-color: var(--primary);
}

.auth-submit {
    margin-top: 12px;
    width: 100%;
}

.auth-message {
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 12px;
    font-size: 0.9rem;
}

.auth-message-error {
    background: rgba(231, 76, 60, 0.25);
    color: #ffb4b4;
    border: 1px solid rgba(231, 76, 60, 0.4);
}

.auth-message-ok {
    background: rgba(46, 213, 115, 0.2);
    color: #b8f5c8;
    border: 1px solid rgba(46, 213, 115, 0.35);
}

.auth-divider {
    text-align: center;
    margin: 1.25rem 0 1rem;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.85rem;
}

.auth-guest-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    text-decoration: none;
    box-sizing: border-box;
}

.auth-hint {
    margin: 12px 0 0;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
}

/* Гостевой экран: ссылка на авторизацию */
.to-auth-link {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    text-decoration: none;
    transition: transform 0.15s, background 0.15s;
}

.to-auth-link:hover {
    background: var(--primary);
    transform: scale(1.06);
}

.auth-user-chip {
    position: fixed;
    top: 22px;
    left: 82px;
    z-index: 1001;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 0.85rem;
    max-width: min(280px, calc(100vw - 200px));
}

.auth-user-chip.hidden {
    display: none;
}

.auth-logout-mini {
    background: rgba(231, 76, 60, 0.35);
    border: 1px solid rgba(231, 76, 60, 0.5);
    color: #fff;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.75rem;
    cursor: pointer;
}

.auth-logout-mini:hover {
    background: rgba(231, 76, 60, 0.55);
}

@media (max-width: 520px) {
    .auth-user-chip {
        left: 72px;
        top: 14px;
        font-size: 0.75rem;
    }
    .to-auth-link {
        top: 12px;
        left: 12px;
        width: 46px;
        height: 46px;
    }
}

/* Сообщения на SPA-экране входа */
.auth-inline-message {
    padding: 12px 14px;
    border-radius: 12px;
    margin-bottom: 16px;
    font-size: 0.9rem;
    text-align: center;
}

.auth-inline-message-error {
    background: rgba(231, 76, 60, 0.2);
    border: 1px solid rgba(231, 76, 60, 0.45);
    color: #ffb4b4;
}

.auth-inline-message-ok {
    background: rgba(46, 213, 115, 0.15);
    border: 1px solid rgba(46, 213, 115, 0.35);
    color: #b8f5c8;
}

.form-input-readonly {
    cursor: not-allowed;
    opacity: 0.88;
    background: rgba(0, 0, 0, 0.35) !important;
}

/* Кнопка профиля (слева, как чат справа) */
.profile-toggle-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--secondary);
    color: #0d1b2a;
    border: none;
    font-size: 1.45rem;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
    transition: transform 0.2s, background 0.2s;
}

.profile-toggle-btn:hover {
    transform: scale(1.08);
    filter: brightness(1.05);
}

/* Панель профиля — зеркало чата, слева */
.profile-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    height: 100vh;
    background: rgba(30, 30, 40, 0.95);
    backdrop-filter: blur(10px);
    border-right: 2px solid var(--primary);
    z-index: 999;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

.profile-header {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profile-header h3 {
    color: var(--secondary);
    font-size: 1.1rem;
    margin: 0;
}

.profile-actions {
    display: flex;
    gap: 10px;
}

.profile-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    color: rgba(255, 255, 255, 0.9);
}

.profile-guest-hint {
    font-size: 0.95rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.65);
}

.profile-field {
    margin-bottom: 18px;
}

.profile-label {
    display: block;
    font-size: 0.8rem;
    color: var(--secondary);
    margin-bottom: 6px;
    font-weight: 600;
}

.profile-value {
    font-size: 1.05rem;
    color: #fff;
}

.profile-stats h4 {
    margin: 20px 0 12px;
    color: var(--secondary);
    font-size: 1rem;
}

.profile-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.profile-stat {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px 8px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-stat span {
    display: block;
    font-size: 1.35rem;
    font-weight: 700;
    color: #fff;
}

.profile-stat small {
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.72rem;
}

.profile-minimized {
    position: fixed;
    top: 90px;
    left: 20px;
    z-index: 998;
}

.profile-restore-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: var(--secondary);
    color: #0d1b2a;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
}

@media (max-width: 520px) {
    .profile-container {
        width: 100%;
        max-width: 100vw;
    }
    .profile-toggle-btn {
        top: 12px;
        left: 12px;
        width: 50px;
        height: 50px;
    }
}
