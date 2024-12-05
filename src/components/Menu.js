import { terminalManager } from '../utils/terminal.js';
import { MENU_OPTIONS, GAME_LOGO, MENU_DESCRIPTIONS } from '../constants/ascii-art.js';
import { LogManager } from '../core/LogManager.js';

export class Menu {
  constructor(options = {}) {
    this.selectedIndex = 0;
    this.terminal = terminalManager;
    this.isActive = true;
    this.logManager = LogManager.getInstance();

    // Configurable options with defaults
    this.options = {
      colorScheme: {
        logo: '\x1b[36m',       // Cyan
        selectedOption: '\x1b[1;37m', // Bright white
        unselectedOption: '\x1b[37m', // White
        instructions: '\x1b[90m', // Gray
        description: '\x1b[33m'  // Yellow
      },
      ...options
    };
  }

  drawOption(option, index) {
    const isSelected = index === this.selectedIndex;
    const indicator = isSelected ? '> ' : '  ';
    const text = `${indicator}${option}`;
    
    const padding = Math.floor((this.terminal.getCols() - text.length) / 2);
    const spaces = ' '.repeat(padding);
    
    if (isSelected) {
      this.terminal.writeLine(`${this.options.colorScheme.selectedOption}${spaces}${text}\x1b[0m`);
    } else {
      this.terminal.writeLine(`${this.options.colorScheme.unselectedOption}${spaces}${text}\x1b[0m`);
    }
  }

  draw() {
    this.terminal.clear();

    // Draw logo with padding
    const logoLines = GAME_LOGO.split('\n');
    logoLines.forEach(line => {
      const padding = Math.floor((this.terminal.getCols() - line.length) / 2);
      const spaces = ' '.repeat(padding);
      this.terminal.writeLine(`${this.options.colorScheme.logo}${spaces}${line}\x1b[0m`);
    });

    // Add spacing between logo and menu
    this.terminal.writeLine('');
    this.terminal.writeLine('');

    // Draw menu options
    MENU_OPTIONS.forEach((option, index) => {
      this.drawOption(option, index);
    });

    // Draw description for selected option
    this.terminal.writeLine('');
    const selectedOption = MENU_OPTIONS[this.selectedIndex];
    if (MENU_DESCRIPTIONS && MENU_DESCRIPTIONS[selectedOption]) {
      const desc = MENU_DESCRIPTIONS[selectedOption];
      const descPadding = Math.floor((this.terminal.getCols() - desc.length) / 2);
      const descSpaces = ' '.repeat(descPadding);
      this.terminal.writeLine(`${this.options.colorScheme.description}${descSpaces}${desc}\x1b[0m`);
    } else {
      // Keep the line empty if no description
      this.terminal.writeLine('');
    }

    // Draw instructions at the bottom
    this.terminal.writeLine('');
    const instructions = "Use ↑↓ arrows to navigate, ENTER to select";
    const instructionsPadding = Math.floor((this.terminal.getCols() - instructions.length) / 2);
    const instructionsSpaces = ' '.repeat(instructionsPadding);
    this.terminal.writeLine(`${this.options.colorScheme.instructions}${instructionsSpaces}${instructions}\x1b[0m`);
  }

  handleInput(input) {
    if (!this.isActive) return;

    // More robust input handling
    const key = typeof input === 'string' ? input : input.key;

    switch(key) {
      case 'UP':
        this.selectedIndex = (this.selectedIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
        this.logManager.logInteraction('Menu Navigation', { 
          direction: 'UP', 
          selectedOption: MENU_OPTIONS[this.selectedIndex] 
        });
        this.draw();
        break;
      case 'DOWN':
        this.selectedIndex = (this.selectedIndex + 1) % MENU_OPTIONS.length;
        this.logManager.logInteraction('Menu Navigation', { 
          direction: 'DOWN', 
          selectedOption: MENU_OPTIONS[this.selectedIndex] 
        });
        this.draw();
        break;
      case 'ENTER':
        this.handleSelection();
        break;
    }
  }

  handleSelection() {
    const selected = MENU_OPTIONS[this.selectedIndex];
    
    // Log the selection
    this.logManager.logInteraction('Menu Selection', { selectedOption: selected });

    switch(selected) {
      case 'Exit':
        this.exit();
        break;
      case 'New Game':
        this.startNewGame();
        break;
      case 'Continue':
        this.continueSavedGame();
        break;
      case 'Options':
        this.openOptionsMenu();
        break;
      default:
        this.terminal.writeLine(`\x1b[1;32mSelected: ${selected}\x1b[0m`);
        setTimeout(() => this.draw(), 1000);
    }
  }

  exit() {
    this.isActive = false;
    this.terminal.clear();
    this.terminal.writeLine('\x1b[1;37mGoodbye! Thanks for playing Astral Nexus!\x1b[0m');
    
    // Optional: Add exit transition or sound effect
    // this.terminal.typeWriter('Shutting down...', 100);
  }

  startNewGame() {
    // Placeholder for new game initialization
    this.terminal.writeLine('\x1b[1;34mInitializing new game...\x1b[0m');
    // Trigger game start logic
  }

  continueSavedGame() {
    // Placeholder for saved game loading
    this.terminal.writeLine('\x1b[1;35mLoading saved game...\x1b[0m');
    // Trigger saved game loading logic
  }

  openOptionsMenu() {
    // Placeholder for options menu
    this.terminal.writeLine('\x1b[1;36mOpening options...\x1b[0m');
    // Trigger options menu logic
  }
}