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

  async draw() {
    this.terminal.clear();
    
    // Add padding and border-like effect
    const cols = this.terminal.getCols();
    const borderChar = '═';
    const sidePadding = '║ ';
    const border = borderChar.repeat(cols);
    
    // Draw top border
    this.terminal.writeLine(`┌${border}┐`, { color: 244 });
    
    // Add some vertical padding
    this.terminal.writeLine(sidePadding.padEnd(cols + 2), { color: 244 });
    
    // Use typewriter effect for narrative
    await this.terminal.typeWriter(
      `${sidePadding}${formatText(this.narrative)}`, 
      { color: 7 }
    );
    this.terminal.writeLine('', { color: 244 });
    
    // Add spacing
    this.terminal.writeLine(sidePadding.padEnd(cols + 2), { color: 244 });
    
    // Display available choices with a different styling
    const availableChoices = this.choices.filter(choice => 
      !choice.condition || choice.condition(this.gameState)
    );

    availableChoices.forEach((choice, index) => {
      const number = index + 1;
      const text = `${sidePadding}${number}. ${choice.text}`;
      this.terminal.writeLine(text, { color: 251 });
    });
    
    // Add bottom spacing
    this.terminal.writeLine(sidePadding.padEnd(cols + 2), { color: 244 });
    
    // Draw bottom border
    this.terminal.writeLine(`└${border}┘`, { color: 244 });
    
    // Display instructions with a subtle color
    this.terminal.writeLine('\r\nEnter a number to choose, or ESC for menu', { color: 240 });
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