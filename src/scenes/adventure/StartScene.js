import { AdventureScene } from '../../core/AdventureScene.js';

export class StartScene extends AdventureScene {
  constructor(terminal, sceneManager) {
    super(terminal, sceneManager, {
      narrative: `[cyan]You find yourself aboard the Astral Nexus, a massive space station at the edge of known space. 
      The emergency lights cast an eerie red glow through the corridors. The station's AI has gone silent, 
      and you're the only crew member who seems to be awake./]

      [yellow]What would you like to do?/]`,
      choices: [
        {
          text: "Check the ship's computer terminal",
          nextScene: 'computer-room',
          onSelect: (gameState) => {
            gameState.setFlag('checked-computer');
          }
        },
        {
          text: "Head to the medical bay",
          nextScene: 'medical-bay',
          condition: (gameState) => !gameState.hasFlag('has-medkit')
        },
        {
          text: "Investigate the strange noise from the cargo hold",
          nextScene: 'cargo-hold'
        }
      ],
      onEnter: (gameState) => {
        gameState.setStat('health', 100);
        gameState.setStat('energy', 100);
      }
    });
  }
}