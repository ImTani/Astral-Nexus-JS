import { Scene } from './Scene.js';
import { MENU_OPTIONS, GAME_LOGO, MENU_DESCRIPTIONS } from '../constants/ascii-art.js';
import { LogManager } from '../core/LogManager.js';

export class MenuScene extends Scene {
  constructor(terminal, sceneManager, options = {}) {
    super(terminal);
    this.selectedIndex = 0;
    this.sceneManager = sceneManager;
    this.logManager = LogManager.getInstance();
    this.isActive = true;

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
      this.terminal.write(this.centerText(`${this.options.colorScheme.selectedOption}${text}\x1b[0m\r\n`));
      
      // Draw description for selected option
      if (MENU_DESCRIPTIONS && MENU_DESCRIPTIONS[option]) {
        const desc = MENU_DESCRIPTIONS[option];
        const descPadding = Math.floor((this.terminal.getCols() - desc.length) / 2);
        const descSpaces = ' '.repeat(descPadding);
        this.terminal.write(this.centerText(`${this.options.colorScheme.description}${desc}\x1b[0m\r\n`));
      }
    } else {
      this.terminal.write(this.centerText(`${this.options.colorScheme.unselectedOption}${text}\x1b[0m\r\n`));
    }
  }

  draw() {
    this.terminal.clear();

    // Draw logo with padding
    const logoLines = GAME_LOGO.split('\n');
    logoLines.forEach(line => {
      this.terminal.write(this.centerText(`${this.options.colorScheme.logo}${line}\x1b[0m\r\n`));
    });

    // Add spacing between logo and menu
    this.terminal.write('\r\n\r\n');

    // Draw menu options
    MENU_OPTIONS.forEach((option, index) => {
      this.drawOption(option, index);
    });

    // Draw instructions at the bottom
    this.terminal.write('\r\n');
    const instructions = "Use ↑↓ arrows to navigate, ENTER to select";
    this.terminal.write(this.centerText(`${this.options.colorScheme.instructions}${instructions}\x1b[0m\r\n`));
  }

  handleInput(key) {
    if (!this.isActive) return;

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
      case 'Play':
        this.sceneManager.switchScene('game');
        break;
      case 'Settings':
        this.sceneManager.switchScene('settings');
        break;
      case 'About':
        this.sceneManager.switchScene('about');
        break;
      default:
        this.terminal.write(this.centerText(`\x1b[1;32mSelected: ${selected}\x1b[0m\r\n`));
        setTimeout(() => this.draw(), 1000);
    }
  }

  exit() {
    this.isActive = false;
    this.terminal.clear();
    this.terminal.write(this.centerText('\x1b[1;37mGoodbye! Thanks for playing Astral Nexus!\x1b[0m\r\n'));
  }

  startNewGame() {
    // Placeholder for new game initialization
    this.terminal.write(this.centerText('\x1b[1;34mInitializing new game...\x1b[0m\r\n'));
    // Trigger game start logic
  }

  continueSavedGame() {
    // Placeholder for saved game loading
    this.terminal.write(this.centerText('\x1b[1;35mLoading saved game...\x1b[0m\r\n'));
    // Trigger saved game loading logic
  }

  openOptionsMenu() {
    // Placeholder for options menu
    this.terminal.write(this.centerText('\x1b[1;36mOpening options...\x1b[0m\r\n'));
    // Trigger options menu logic
  }
}