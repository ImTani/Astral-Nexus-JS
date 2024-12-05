import { LogManager } from './LogManager.js';

export class GameState {
  static instance = null;

  constructor() {
    this.inventory = new Set();
    this.stats = {
      health: 100,
      energy: 100,
    };
    this.flags = new Set();
    this.variables = new Map();
    this.logger = LogManager.getInstance();
  }

  static getInstance() {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  hasItem(item) {
    return this.inventory.has(item);
  }

  addItem(item) {
    this.inventory.add(item);
    this.logger.logInventory('Added', item);
  }

  removeItem(item) {
    this.inventory.delete(item);
    this.logger.logInventory('Removed', item);
  }

  setFlag(flag) {
    this.flags.add(flag);
    this.logger.logSystemEvent(`Flag set: ${flag}`);
  }

  hasFlag(flag) {
    return this.flags.has(flag);
  }

  clearFlag(flag) {
    this.flags.delete(flag);
    this.logger.logSystemEvent(`Flag cleared: ${flag}`);
  }

  setStat(stat, value) {
    const oldValue = this.stats[stat];
    this.stats[stat] = value;
    this.logger.logSystemEvent(`Stat ${stat} changed: ${oldValue} → ${value}`);
  }

  getStat(stat) {
    return this.stats[stat];
  }

  setVariable(key, value) {
    this.variables.set(key, value);
    this.logger.logSystemEvent(`Variable ${key} set to: ${value}`);
  }

  getVariable(key) {
    return this.variables.get(key);
  }

  save() {
    const saveData = {
      inventory: Array.from(this.inventory),
      stats: this.stats,
      flags: Array.from(this.flags),
      variables: Array.from(this.variables.entries()),
    };
    localStorage.setItem('gameState', JSON.stringify(saveData));
    this.logger.logSystemEvent('Game state saved');
  }

  load() {
    const saveData = JSON.parse(localStorage.getItem('gameState'));
    if (saveData) {
      this.inventory = new Set(saveData.inventory);
      this.stats = saveData.stats;
      this.flags = new Set(saveData.flags);
      this.variables = new Map(saveData.variables);
      this.logger.logSystemEvent('Game state loaded');
    }
  }
}