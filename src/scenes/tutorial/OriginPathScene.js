import { AdventureScene } from '../../core/AdventureScene.js';
import { PlayerProfile } from '../../core/PlayerProfile.js';

export class OriginPathScene extends AdventureScene {
  constructor(terminal, sceneManager) {
    super(terminal, sceneManager, {
      narrative: '[yellow]Choose your starting path:/]',
      choices: [
        {
          text: 'Warrior of the Northern Realms',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              path: 'warrior'
            });
          },
          nextScene: 'origin-motivation'
        },
        {
          text: 'Mystic from the Eastern Temples',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              path: 'mystic'
            });
          },
          nextScene: 'origin-motivation'
        },
        {
          text: 'Wanderer from the Southern Deserts',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              path: 'wanderer'
            });
          },
          nextScene: 'origin-motivation'
        }
      ]
    });
  }
}