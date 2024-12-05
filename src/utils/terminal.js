import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '../../node_modules/@xterm/xterm/css/xterm.css';

class TerminalManager {
  constructor() {
    this.term = new Terminal({
      cursorBlink: false,
      fontSize: 14,
      fontFamily: 'monospace',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
      },
      convertEol: true,
      cursorStyle: 'block',
    });

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.keyHandlers = new Set();
  }

  init(containerId) {
    this.term.open(document.getElementById(containerId));
    this.fitAddon.fit();

    window.addEventListener('resize', () => {
      this.fitAddon.fit();
    });

    this.term.onKey(({ key, domEvent }) => {
      const mappedKey = this.mapKey(domEvent);
      this.keyHandlers.forEach((handler) => handler(mappedKey));
    });
  }

  mapKey(event) {
    // Map keyboard events to consistent key names
    if (event.key === 'ArrowUp') return 'UP';
    if (event.key === 'ArrowDown') return 'DOWN';
    if (event.key === 'Enter') return 'ENTER';
    if (event.key === 'Escape') return 'ESC';
    return event.key;
  }

  write(text) {
    this.term.write(text);
  }

  writeLine(text) {
    this.term.writeln(text);
  }

  clear() {
    this.term.clear();
  }

  onKey(callback) {
    this.keyHandlers.add(callback);
    return () => this.keyHandlers.delete(callback);
  }

  getCols() {
    return this.term.cols;
  }

  getRows() {
    return this.term.rows;
  }
}

export const terminalManager = new TerminalManager();
export const clearScreen = () => terminalManager.clear();
