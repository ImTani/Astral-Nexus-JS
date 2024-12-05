import { AdventureScene } from '../../core/AdventureScene.js';
import { PlayerProfile } from '../../core/PlayerProfile.js';
import { formatText } from '../../utils/textFormatter.js';

export class OriginFearScene extends AdventureScene {
  constructor(terminal, sceneManager) {
    super(terminal, sceneManager, {
      narrative: '[yellow]What is your character\'s greatest fear?/]\n\n[cyan]Type your response and press ENTER:/]',
      choices: []
    });
    
    this.userInput = '';
  }

  draw() {
    this.terminal.clear();
    this.terminal.write(formatText(this.narrative) + '\r\n\r\n');
    this.terminal.write(`> ${this.userInput}_`);
  }

  handleInput(key) {
    if (!this.isActive) return;

    if (key === 'ENTER' && this.userInput.trim()) {
      PlayerProfile.getInstance().saveProfile({
        ...PlayerProfile.getInstance().getProfile(),
        greatestFear: this.userInput.trim()
      });
      this.sceneManager.switchScene('game');
    } else if (key === 'BACKSPACE') {
      this.userInput = this.userInput.slice(0, -1);
      this.draw();
    } else if (key.length === 1) {
      this.userInput += key;
      this.draw();
    }
  }
}