import { LogManager } from './LogManager.js';

export class PlayerProfile {
  static instance = null;
  
  constructor() {
    this.logger = LogManager.getInstance();
    this.playerId = localStorage.getItem('playerId');
    this.profile = this.loadProfile();
  }

  static getInstance() {
    if (!PlayerProfile.instance) {
      PlayerProfile.instance = new PlayerProfile();
    }
    return PlayerProfile.instance;
  }

  loadProfile() {
    const savedProfile = localStorage.getItem('playerProfile');
    if (savedProfile) {
      this.logger.logSystemEvent('Player profile loaded');
      return JSON.parse(savedProfile);
    }
    return null;
  }

  saveProfile(data) {
    if (!this.playerId) {
      this.playerId = `player_${Date.now()}`;
      localStorage.setItem('playerId', this.playerId);
      this.logger.logSystemEvent('New player ID generated');
    }

    const oldProfile = this.profile || {};
    this.profile = {
      ...data,
      playerId: this.playerId,
      timestamp: new Date().toISOString()
    };

    // Log changes
    Object.entries(this.profile).forEach(([key, value]) => {
      if (value !== oldProfile[key]) {
        this.logger.logProfileUpdate(key, value);
      }
    });

    localStorage.setItem('playerProfile', JSON.stringify(this.profile));
  }

  hasProfile() {
    return !!this.profile;
  }

  getProfile() {
    return this.profile;
  }
}