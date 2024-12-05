import { centerText } from '../utils/textUtils.js';

export class Scene {
  constructor(terminal) {
    this.terminal = terminal;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.draw();
  }

  deactivate() {
    this.isActive = false;
  }

  draw() {
    // Base draw method - to be implemented by child classes
  }

  handleInput(key) {
    // Base input handler - to be implemented by child classes
  }

  centerText(text) {
    return centerText(text, this.terminal.getCols());
  }
}