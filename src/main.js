import { GameTerminal } from './components/GameTerminal.js';
import { SidePanel } from './components/SidePanel.js';
import { SceneManager } from './managers/SceneManager.js';
import { initializeLayout } from './utils/layout.js';
import { LogManager } from './core/LogManager.js';

function initializeGame() {
  // Initialize layout
  initializeLayout();
  
  // Initialize game components
  const gameTerminal = new GameTerminal('terminal').init();
  const sidePanel = new SidePanel('side-panel').init();
  const sceneManager = new SceneManager(gameTerminal);
  const logManager = LogManager.getInstance();
  
  // Start with menu scene
  sceneManager.switchScene('menu');
  
  // Example side panel updates
  logManager.logSystemEvent('Game started');
  sidePanel.updateInventory(['Health Potion', 'Energy Crystal']);
  sidePanel.updateInfo('Player Level: 1\nHealth: 100/100\nEnergy: 50/50');

  // Handle keyboard input
  const keyHandler = gameTerminal.onKey(({ key, originalEvent }) => {
    console.log('Key pressed:', key, originalEvent); // Add logging for debugging
    const mappedKey = mapKey(originalEvent);
    sceneManager.handleInput(mappedKey);
  });

  // Cleanup on window unload
  window.addEventListener('unload', () => {
    keyHandler.dispose();
  });
}

function mapKey(event) {
  if (!event) {
    console.error('Undefined event in mapKey');
    return null;
  }
  
  // More robust key mapping
  if (event.key === 'ArrowUp') return 'UP';
  if (event.key === 'ArrowDown') return 'DOWN';
  if (event.key === 'Enter') return 'ENTER';
  if (event.key === 'Escape') return 'ESC';
  return event.key;
}

initializeGame();