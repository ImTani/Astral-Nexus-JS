import { Scene } from './Scene.js';

export class SettingsScene extends Scene {
  constructor(terminal, sceneManager) {
    super(terminal);
    this.sceneManager = sceneManager;
  }

  draw() {
    this.terminal.clear();
    this.terminal.write(this.centerText('\x1b[1;33mSettings\x1b[0m\r\n\r\n'));
    this.terminal.write(this.centerText('\x1b[37mPress ESC to return to menu\x1b[0m\r\n'));
  }

  handleInput(key) {
    if (!this.isActive) return;

    if (key === 'ESC') {
      this.sceneManager.switchScene('menu');
    }
  }
}