'use strict';

class WebSocketAPI {
  #socket = null;
  #token;
  #host;
  #wsEndpointAddress;
  #sessionStorageFlag = 'wsConnected';
  #messageHandlers = new Map();
  #messageQueue = [];
  #nextMessageId = 1;
  #messageListeners = new Map();

  /**
   * API namespaces
   */
  auth = {
    login: (credentials) => this.#sendRequest({
      method: 'auth/login',
      type: 'call',
      params: credentials,
    }),
    signup: (userData) => this.#sendRequest({
      method: 'auth/signup',
      type: 'call',
      params: userData,
    }),
  };

  constructor(token, host, wsEndpointAddress) {
    this.#token = token;
    this.#host = host;
    this.#wsEndpointAddress = wsEndpointAddress;
  };

  connect() {
    if (
      this.#socket &&
      (this.#socket.readyState === WebSocket.OPEN || this.#socket.readyState === WebSocket.CONNECTING) &&
      sessionStorage.getItem(this.#sessionStorageFlag) === 'true'
    ) {
      console.log('WebSocket is already connected or in connection progress');
      return this;
    }

    console.log('Creating new WebSocket connection...');
    this.#socket = new WebSocket(`ws://${this.#host}${this.#wsEndpointAddress}?token=${this.#token}`);

    this.#socket.onopen = () => {
      console.log('WebSocket connection established');
      sessionStorage.setItem(this.#sessionStorageFlag, 'true');
      // Send any queued messages
      this.#processQueue();
    };

    this.#socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        // Handle request-response messages
        if (response.id && this.#messageHandlers.has(response.id)) {
          const { resolve, reject } = this.#messageHandlers.get(response.id);
          if (!response) reject('No response');
          resolve(response);
          this.#messageHandlers.delete(response.id);
        }
        // Handle real-time chat messages
        if (!response.id && response.type === 'message' && response.conversationId) {
          const listeners = this.#messageListeners.get(response.conversationId);
          if (listeners) {
            listeners.forEach(callback => {
              try {
                callback(response);
              } catch (error) {
                console.error('Error in message listener callback:', error);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.#socket.onclose = () => {
      console.log('WebSocket connection closed');
      sessionStorage.setItem(this.#sessionStorageFlag, 'false');
      this.#socket = null;
    };

    this.#socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return this;
  };

  #sendRequest({ method, type, params = {} }) {
    return new Promise((resolve, reject) => {
      const id = this.#nextMessageId++;
      const message = {
        id,
        type,
        method,
        params,
        token: this.#token,
      };

      this.#messageHandlers.set(id, { resolve, reject });

      if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
        this.#socket.send(JSON.stringify(message));
      } else {
        this.#messageQueue.push(message);
        if (!this.#socket || this.#socket.readyState === WebSocket.CLOSED) {
          this.connect();
        }
      }
    });
  };

  #processQueue() {
    if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
      while (this.#messageQueue.length > 0) {
        const message = this.#messageQueue.shift();
        this.#socket.send(JSON.stringify(message));
      }
    }
  };

  socket() {
    return this.#socket;
  };

  disconnect() {
    if (this.#socket) {
      this.#socket.close();
      this.#socket = null;
    }
  };

  // Add method to subscribe to real-time messages
  subscribeToMessages(conversationId, callback) {
    if (!this.#messageListeners.has(conversationId)) {
      this.#messageListeners.set(conversationId, new Set());
    }
    this.#messageListeners.get(conversationId).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.#messageListeners.get(conversationId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.#messageListeners.delete(conversationId);
        }
      }
    };
  }

  // Add method to unsubscribe from messages
  unsubscribeFromMessages(conversationId, callback) {
    const listeners = this.#messageListeners.get(conversationId);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.#messageListeners.delete(conversationId);
      }
    }
  }
};

/**
 * Initialize WebSocket API connection with environment-specific configuration
 * Configuration is expected to be set by the application before this script runs
 */
const wsConfig = window.wsConfig;
console.log('wsConfig in apiConnection:', wsConfig);

if (!wsConfig || !wsConfig.host || !wsConfig.port) {
  console.error('WebSocket configuration is missing or incomplete. Please check your environment variables.');
  console.error('Expected configuration:', {
    host: 'VITE_WS_HOST environment variable',
    port: 'VITE_WS_PORT environment variable',
  });
  console.error('Actual configuration:', wsConfig);
} else {
  window.api = new WebSocketAPI(
    // window.Cookies.get('ACCESS_TOKEN'),
    '',
    `${wsConfig.host}:${wsConfig.port}`,
    '/api/ws/v1'
  ).connect();
};
