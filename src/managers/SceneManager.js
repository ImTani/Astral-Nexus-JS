import { MenuScene } from '../scenes/MenuScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { SettingsScene } from '../scenes/SettingsScene.js';
import { AboutScene } from '../scenes/AboutScene.js';
import { StartScene } from '../scenes/adventure/StartScene.js';
import { OriginStoryScene } from '../scenes/tutorial/OriginStoryScene.js';
import { OriginPathScene } from '../scenes/tutorial/OriginPathScene.js';
import { OriginMotivationScene } from '../scenes/tutorial/OriginMotivationScene.js';
import { OriginPastScene } from '../scenes/tutorial/OriginPastScene.js';
import { OriginFearScene } from '../scenes/tutorial/OriginFearScene.js';
import { PlayerProfile } from '../core/PlayerProfile.js';
import { LogManager } from '../core/LogManager.js';

export class SceneManager {
  constructor(terminal) {
    this.terminal = terminal;
    this.currentScene = null;
    this.scenes = new Map();
    this.logger = LogManager.getInstance();
    this.playerProfile = PlayerProfile.getInstance();

    // Initialize scenes
    this.scenes.set('menu', new MenuScene(terminal, this));
    this.scenes.set('game', new StartScene(terminal, this));
    this.scenes.set('settings', new SettingsScene(terminal, this));
    this.scenes.set('about', new AboutScene(terminal, this));
    
    // Origin story scenes
    this.scenes.set('origin-story', new OriginStoryScene(terminal, this));
    this.scenes.set('origin-path', new OriginPathScene(terminal, this));
    this.scenes.set('origin-motivation', new OriginMotivationScene(terminal, this));
    this.scenes.set('origin-past', new OriginPastScene(terminal, this));
    this.scenes.set('origin-fear', new OriginFearScene(terminal, this));
  }

  switchScene(sceneName) {
    // Check if player needs to go through origin story
    if (sceneName === 'game' && !this.playerProfile.hasProfile()) {
      sceneName = 'origin-story';
    }

    if (this.currentScene) {
      this.currentScene.deactivate();
    }

    const newScene = this.scenes.get(sceneName);
    if (newScene) {
      this.currentScene = newScene;
      this.currentScene.activate();
      this.logger.logSystemEvent(`Switched to scene: ${sceneName}`);
    }
  }

  handleInput(key) {
    if (this.currentScene) {
      this.currentScene.handleInput(key);
    }
  }
}