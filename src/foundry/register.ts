import { CharacterData } from './data/character-data';
import { CharacterSheet } from './sheets/character-sheet';

/** One composition root owns registration; features do not register themselves. */
export function registerSystem(): void {
  CONFIG.Actor.dataModels.character = CharacterData;
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Actor,
    'modern-chimera-d20',
    CharacterSheet,
    {
      types: ['character'],
      makeDefault: true,
      label: 'MCD20.Sheet.Title',
    },
  );
}
