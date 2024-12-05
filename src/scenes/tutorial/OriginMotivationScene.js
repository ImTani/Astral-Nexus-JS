import { AdventureScene } from '../../core/AdventureScene.js';
import { PlayerProfile } from '../../core/PlayerProfile.js';

export class OriginMotivationScene extends AdventureScene {
  constructor(terminal, sceneManager) {
    super(terminal, sceneManager, {
      narrative: '[yellow]Select your primary motivation:/]',
      choices: [
        {
          text: 'Seeking redemption',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              motivation: 'redemption'
            });
          },
          nextScene: 'origin-past'
        },
        {
          text: 'Pursuing knowledge',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              motivation: 'knowledge'
            });
          },
          nextScene: 'origin-past'
        },
        {
          text: 'Avenging a loss',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              motivation: 'vengeance'
            });
          },
          nextScene: 'origin-past'
        },
        {
          text: 'Finding adventure',
          onSelect: (gameState) => {
            PlayerProfile.getInstance().saveProfile({
              ...PlayerProfile.getInstance().getProfile(),
              motivation: 'adventure'
            });
          },
          nextScene: 'origin-past'
        }
      ]
    });
  }
}