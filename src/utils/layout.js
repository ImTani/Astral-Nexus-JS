export function initializeLayout() {
  const mainContainer = document.createElement('div');
  mainContainer.id = 'game-container';
  mainContainer.className = 'game-container';

  const terminalContainer = document.createElement('div');
  terminalContainer.id = 'terminal';
  terminalContainer.className = 'terminal-container';

  const sidePanelContainer = document.createElement('div');
  sidePanelContainer.id = 'side-panel';
  sidePanelContainer.className = 'side-panel-container';

  mainContainer.appendChild(terminalContainer);
  mainContainer.appendChild(sidePanelContainer);

  // Replace the existing terminal div with our new layout
  const oldTerminal = document.getElementById('terminal');
  oldTerminal.parentNode.replaceChild(mainContainer, oldTerminal);
}