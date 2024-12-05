import { Scene } from '../scenes/Scene.js';
import { formatText } from '../utils/textFormatter.js';
import { GameState } from './GameState.js';

export class AdventureScene extends Scene {
  constructor(terminal, sceneManager, config) {
    super(terminal);
    this.sceneManager = sceneManager;
    this.narrative = config.narrative;
    this.choices = config.choices || [];
    this.conditions = config.conditions || {};
    this.onEnter = config.onEnter || (() => {});
    this.onExit = config.onExit || (() => {});
    this.gameState = GameState.getInstance();
  }

  draw() {
    this.terminal.clear();
    
    // Display narrative
    this.terminal.write(formatText(this.narrative) + '\r\n\r\n');

    // Display available choices
    const availableChoices = this.choices.filter(choice => 
      !choice.condition || choice.condition(this.gameState)
    );

    availableChoices.forEach((choice, index) => {
      const number = index + 1;
      const text = `${number}. ${choice.text}`;
      this.terminal.write(`\x1b[37m${text}\x1b[0m\r\n`);
    });

    // Display instructions
    this.terminal.write('\r\n\x1b[90mEnter a number to choose, or ESC for menu\x1b[0m\r\n');
  }

  handleInput(key) {
    if (!this.isActive) return;

    if (key === 'ESC') {
      this.sceneManager.switchScene('menu');
      return;
    }

    const number = parseInt(key);
    if (isNaN(number)) return;

    const availableChoices = this.choices.filter(choice => 
      !choice.condition || choice.condition(this.gameState)
    );

    if (number > 0 && number <= availableChoices.length) {
      const choice = availableChoices[number - 1];
      
      if (choice.onSelect) {
        choice.onSelect(this.gameState);
      }

      if (choice.nextScene) {
        this.sceneManager.switchScene(choice.nextScene);
      }
    }
  }

  activate() {
    super.activate();
    this.onEnter(this.gameState);
  }

  deactivate() {
    super.deactivate();
    this.onExit(this.gameState);
  }
}