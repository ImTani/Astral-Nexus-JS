import { formatTimestamp } from '../utils/dateFormatter.js';

export class LogManager {
  static instance = null;
  
  constructor(options = {}) {
    this.logs = [];
    this.subscribers = new Set();
    
    // Configurable options
    this.options = {
      maxLogs: 500,
      persistLogs: false,
      storageKey: 'astralNexusGameLogs',
      ...options
    };

    // Try to load persisted logs if enabled
    if (this.options.persistLogs) {
      this.loadPersistedLogs();
    }
  }

  static getInstance(options = {}) {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager(options);
    }
    return LogManager.instance;
  }

  addLog(type, message, data = {}) {
    const log = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type,
      message,
      data
    };

    // Manage log capacity
    if (this.logs.length >= this.options.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    this.logs.push(log);
    this.notifySubscribers(log);

    // Persist logs if enabled
    if (this.options.persistLogs) {
      this.persistLogs();
    }

    return log;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(log) {
    this.subscribers.forEach(callback => callback(log));
  }

  // Enhanced logging methods with more context and flexibility
  logInteraction(action, details = {}) {
    return this.addLog('interaction', action, details);
  }

  logInventory(action, item, quantity = 1, details = {}) {
    return this.addLog('inventory', `${action}: ${item} (x${quantity})`, {
      item,
      quantity,
      ...details
    });
  }

  logProfileUpdate(field, value, details = {}) {
    return this.addLog('profile', `Updated ${field}`, { 
      field, 
      value,
      ...details 
    });
  }

  logSystemEvent(event, details = {}) {
    return this.addLog('system', event, details);
  }

  logCombat(action, details = {}) {
    return this.addLog('combat', action, details);
  }

  // Advanced log retrieval methods
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  getLogsByType(type, count = null) {
    const filteredLogs = this.logs.filter(log => log.type === type);
    return count ? filteredLogs.slice(-count) : filteredLogs;
  }

  searchLogs(query) {
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(log.data).toLowerCase().includes(query.toLowerCase())
    );
  }

  // Persistence methods
  persistLogs() {
    if (!this.options.persistLogs) return;

    try {
      const serializedLogs = JSON.stringify(this.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString() // Convert to string for storage
      })));
      localStorage.setItem(this.options.storageKey, serializedLogs);
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }

  loadPersistedLogs() {
    try {
      const storedLogs = localStorage.getItem(this.options.storageKey);
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        this.logs = parsedLogs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp) // Convert back to Date object
        }));
      }
    } catch (error) {
      console.error('Failed to load persisted logs:', error);
    }
  }

  // Clear logs with optional type filtering
  clearLogs(type = null) {
    if (type) {
      this.logs = this.logs.filter(log => log.type !== type);
    } else {
      this.logs = [];
    }

    // Update persistent storage if enabled
    if (this.options.persistLogs) {
      this.persistLogs();
    }
  }

  // Export logs for backup or analysis
  exportLogs(format = 'json') {
    switch(format) {
      case 'json':
        return JSON.stringify(this.logs, null, 2);
      case 'csv':
        // Basic CSV export
        const headers = ['id', 'timestamp', 'type', 'message'];
        const csvRows = [
          headers.join(','),
          ...this.logs.map(log => 
            headers.map(header => 
              header === 'timestamp' 
                ? formatTimestamp(log[header]) 
                : `"${log[header] || ''}"`
            ).join(',')
          )
        ];
        return csvRows.join('\n');
      default:
        throw new Error('Unsupported export format');
    }
  }
}