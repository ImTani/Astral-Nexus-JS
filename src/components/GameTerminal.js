import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import '../../node_modules/@xterm/xterm/css/xterm.css'

export class GameTerminal {
  constructor(containerId, options = {}) {
    // Merge default options with user-provided options
    const defaultOptions = {
      cursorBlink: false,
      fontSize: 14,
      fontFamily: 'monospace',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        black: '#000000',
        red: '#FF5555',
        green: '#50FA7B',
        yellow: '#F1FA8C',
        blue: '#BD93F9',
        magenta: '#FF79C6',
        cyan: '#8BE9FD',
        white: '#FFFFFF',
        brightBlack: '#555555',
      },
      convertEol: true,
      cursorStyle: 'block',
      scrollback: 1000, // Increased scrollback buffer
    };

    this.options = { ...defaultOptions, ...options };
    
    this.term = new Terminal(this.options);

    // Add more addons for enhanced functionality
    this.fitAddon = new FitAddon();
    this.webLinksAddon = new WebLinksAddon();
    this.searchAddon = new SearchAddon();

    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(this.webLinksAddon);
    this.term.loadAddon(this.searchAddon);

    this.container = document.getElementById(containerId);
    
    // Bind methods to ensure correct context
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    this.term.open(this.container);
    this.fitAddon.fit();
    
    window.addEventListener('resize', this.handleResize);
    
    return this;
  }

  handleResize() {
    this.fitAddon.fit();
    // Optional: emit a resize event for game to adjust layout
    this.term.emit('terminalResize', {
      cols: this.term.cols,
      rows: this.term.rows
    });
  }

  // Enhanced writing methods
  write(text, styles = {}) {
    // Add optional styling support
    const styleSequence = Object.entries(styles).map(([key, value]) => {
      switch(key) {
        case 'color': return `\x1b[38;5;${value}m`;
        case 'background': return `\x1b[48;5;${value}m`;
        case 'bold': return value ? '\x1b[1m' : '\x1b[22m';
        case 'italic': return value ? '\x1b[3m' : '\x1b[23m';
        case 'underline': return value ? '\x1b[4m' : '\x1b[24m';
        default: return '';
      }
    }).join('');

    this.term.write(`${styleSequence}${text}\x1b[0m`);
  }

  writeLine(text, styles = {}) {
    this.write(`${text}\r\n`, styles);
  }

  clear() {
    this.term.clear();
  }

  // Enhanced key handling with more details
  onKey(callback) {
    // Ensure we're returning the disposable handler
    return this.term.onKey(({ key, domEvent }) => {
      console.log('Key event:', { key, domEvent }); // Add logging for debugging
      
      // Normalize key names
      let keyName = key;
      if (domEvent.key === 'ArrowUp') keyName = 'UP';
      else if (domEvent.key === 'ArrowDown') keyName = 'DOWN';
      else if (domEvent.key === 'ArrowLeft') keyName = 'LEFT';
      else if (domEvent.key === 'ArrowRight') keyName = 'RIGHT';
      else if (domEvent.key === 'Enter') keyName = 'ENTER';
      
      // Call the provided callback with normalized key information
      callback({
        key: keyName,
        originalEvent: domEvent,
        altKey: domEvent.altKey,
        ctrlKey: domEvent.ctrlKey,
        shiftKey: domEvent.shiftKey
      });
    });
  }

  // New methods for more advanced terminal interactions
  typeWriter(text, speed = 50) {
    return new Promise(resolve => {
      let i = 0;
      const typeNextChar = () => {
        if (i < text.length) {
          this.term.write(text.charAt(i));
          i++;
          setTimeout(typeNextChar, speed);
        } else {
          resolve();
        }
      };
      typeNextChar();
    });
  }

  getCols() {
    return this.term.cols;
  }

  getRows() {
    return this.term.rows;
  }

  // Cleanup method to remove event listeners
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.term.dispose();
  }
}