/**
 * Система чата для викторины (только общий чат)
 * Обработка ошибок и восстановление соединений
 */
class QuizChat {
    constructor(socket, gameClient) {
        this.socket = socket;
        this.gameClient = gameClient;
        
        this.isConnected = false;
        this.isInLobby = false;
        this.lobbyCode = null;
        this.playerId = null;
        this.playerName = '';
        
        this.chatHistory = [];
        this.unreadMessages = 0;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        this.initElements();
        this.setupEventListeners();
        this.setupSocketListeners();
        
        console.log('Чат инициализирован (общий)');
    }
    
    initElements() {
        this.elements = {
            chatContainer: document.getElementById('chatContainer'),
            chatMinimized: document.getElementById('chatMinimized'),
            toggleChatBtn: document.getElementById('toggleChatBtn'),
            chatMinimizeBtn: document.getElementById('chatMinimizeBtn'),
            chatCloseBtn: document.getElementById('chatCloseBtn'),
            chatRestoreBtn: document.getElementById('chatRestoreBtn'),
            chatMessages: document.getElementById('chatMessages'),
            chatInput: document.getElementById('chatInput'),
            sendChatBtn: document.getElementById('sendChatBtn'),
            connectionStatus: document.getElementById('connectionStatus'),
            chatNotificationBadge: document.getElementById('chatNotificationBadge'),
            minimizedMessageCount: document.getElementById('minimizedMessageCount')
        };
    }
    
    setupEventListeners() {
        this.elements.toggleChatBtn.addEventListener('click', () => this.toggleChat());
        this.elements.chatMinimizeBtn.addEventListener('click', () => this.minimizeChat());
        this.elements.chatCloseBtn.addEventListener('click', () => this.closeChat());
        this.elements.chatRestoreBtn.addEventListener('click', () => this.restoreChat());
        
        this.elements.sendChatBtn.addEventListener('click', () => this.sendMessage());
        this.elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    setupSocketListeners() {
        this.socket.on('connect', () => this.handleConnect());
        this.socket.on('disconnect', () => this.handleDisconnect());
        this.socket.on('connect_error', (error) => this.handleConnectError(error));
        
        this.socket.on('chatMessage', (data) => this.handleChatMessage(data));
        this.socket.on('chatHistory', (data) => this.handleChatHistory(data));
        this.socket.on('chatError', (data) => this.handleChatError(data));
        this.socket.on('chatConnected', (data) => this.handleChatConnected(data));
    }
    
    handleConnect() {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus('connected');
        if (this.isInLobby && this.lobbyCode) this.joinChat();
    }
    
    handleDisconnect() {
        this.isConnected = false;
        this.updateConnectionStatus('disconnected');
        this.attemptReconnect();
    }
    
    handleConnectError(error) {
        console.error('Ошибка подключения WebSocket:', error);
        this.updateConnectionStatus('reconnecting');
        this.addSystemMessage('Ошибка подключения к серверу. Попытка переподключения...');
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.addSystemMessage('Не удалось подключиться к серверу. Обновите страницу.');
            return;
        }
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        setTimeout(() => {
            if (!this.isConnected) this.socket.connect();
        }, delay);
    }
    
    updateConnectionStatus(status) {
        const el = this.elements.connectionStatus;
        if (!el) return;
        el.className = `status-indicator status-${status}`;
        el.innerHTML = status === 'connected' ? '<i class="fas fa-circle"></i> Подключен' :
                       status === 'disconnected' ? '<i class="fas fa-circle"></i> Отключен' :
                       '<i class="fas fa-circle"></i> Переподключение...';
    }
    
    joinChat() {
        if (!this.isConnected || !this.lobbyCode || !this.playerId) return;
        this.socket.emit('joinChat', {
            lobbyCode: this.lobbyCode,
            playerId: this.playerId,
            playerName: this.playerName
        });
    }
    
    handleChatConnected(data) {
        this.isInLobby = true;
        this.elements.chatInput.disabled = false;
        this.elements.sendChatBtn.disabled = false;
        this.elements.chatInput.placeholder = "Введите сообщение...";
        // Чат не открывается автоматически, только по желанию пользователя
        this.addSystemMessage(`Вы подключены к чату лобби ${this.lobbyCode}`);
        this.socket.emit('getChatHistory', { lobbyCode: this.lobbyCode });
    }
    
    handleChatMessage(data) {
        this.chatHistory.push(data);
        if (this.chatHistory.length > 200) this.chatHistory = this.chatHistory.slice(-200);
        this.displayMessage(data);
        if (this.elements.chatContainer.classList.contains('hidden') || 
            this.elements.chatMinimized.classList.contains('hidden')) {
            this.unreadMessages++;
            this.updateNotificationBadge();
        }
    }
    
    handleChatHistory(data) {
        this.chatHistory = data.messages || [];
        this.elements.chatMessages.innerHTML = `
            <div class="system-message">
                <i class="fas fa-info-circle"></i> Добро пожаловать в общий чат!
            </div>
        `;
        this.chatHistory.forEach(msg => this.displayMessage(msg));
        this.scrollToBottom();
    }
    
    handleChatError(data) {
        this.addSystemMessage(`Ошибка: ${data.message}`, true);
    }
    
    sendMessage() {
        const message = this.elements.chatInput.value.trim();
        if (!message || !this.isConnected || !this.isInLobby) return;
        
        const messageData = {
            lobbyCode: this.lobbyCode,
            senderId: this.playerId,
            senderName: this.playerName,
            message: message,
            timestamp: Date.now()
        };
        
        this.socket.emit('chatMessage', messageData);
        this.elements.chatInput.value = '';
        this.elements.chatInput.focus();
    }
    
    displayMessage(data) {
        const msgDiv = document.createElement('div');
        const msgClass = data.senderId === this.playerId ? 'sent' : 
                        (data.senderId === 'system' ? 'system' : 'received');
        msgDiv.className = `chat-message ${msgClass}`;
        
        const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sender = data.senderId === this.playerId ? 'Вы' : 
                      (data.senderId === 'system' ? 'Система' : data.senderName);
        
        msgDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${sender}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(data.message)}</div>
        `;
        
        this.elements.chatMessages.appendChild(msgDiv);
        this.scrollToBottom();
    }
    
    addSystemMessage(text, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message system';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const icon = isError ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
        msgDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender"><i class="${icon}"></i> Система</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(text)}</div>
        `;
        this.elements.chatMessages.appendChild(msgDiv);
        this.scrollToBottom();
    }
    
    showChat() {
        this.elements.chatContainer.classList.remove('hidden');
        this.elements.chatMinimized.classList.add('hidden');
        this.elements.toggleChatBtn.classList.add('hidden');
        this.unreadMessages = 0;
        this.updateNotificationBadge();
        setTimeout(() => {
            this.scrollToBottom();
            if (!this.elements.chatInput.disabled) this.elements.chatInput.focus();
        }, 100);
    }
    
    hideChat() {
        this.elements.chatContainer.classList.add('hidden');
        this.elements.chatMinimized.classList.add('hidden');
        this.elements.toggleChatBtn.classList.remove('hidden');
    }
    
    toggleChat() {
        if (this.elements.chatContainer.classList.contains('hidden')) {
            this.showChat();
        } else {
            this.minimizeChat();
        }
    }
    
    minimizeChat() {
        this.elements.chatContainer.classList.add('hidden');
        this.elements.chatMinimized.classList.remove('hidden');
        this.elements.minimizedMessageCount.textContent = this.unreadMessages > 0 ? this.unreadMessages : '0';
    }
    
    restoreChat() {
        this.showChat();
    }
    
    closeChat() {
        this.hideChat();
    }
    
    scrollToBottom() {
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }
    
    updateNotificationBadge() {
        const badge = this.elements.chatNotificationBadge;
        const minBadge = this.elements.minimizedMessageCount;
        if (this.unreadMessages > 0) {
            badge.textContent = this.unreadMessages;
            badge.classList.remove('hidden');
            if (minBadge) minBadge.textContent = this.unreadMessages;
        } else {
            badge.classList.add('hidden');
            if (minBadge) minBadge.textContent = '0';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setPlayerData(playerId, playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
    }
    
    setLobby(lobbyCode) {
        this.lobbyCode = lobbyCode;
        this.isInLobby = true;
        this.chatHistory = [];
        this.unreadMessages = 0;
        this.updateNotificationBadge();
        this.joinChat();
    }
    
    leaveLobby() {
        this.isInLobby = false;
        this.lobbyCode = null;
        this.elements.chatInput.disabled = true;
        this.elements.sendChatBtn.disabled = true;
        this.elements.chatInput.placeholder = "Чат доступен только в лобби";
        this.elements.chatMessages.innerHTML = `
            <div class="system-message">
                <i class="fas fa-info-circle"></i> Добро пожаловать в общий чат!
            </div>
        `;
        this.hideChat();
    }
    
    destroy() {
        this.leaveLobby();
        // Удаление обработчиков (при необходимости)
    }
}