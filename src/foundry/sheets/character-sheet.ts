const { HandlebarsApplicationMixin } = foundry.applications.api;

export class CharacterSheet extends HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2,
) {
  static override DEFAULT_OPTIONS = {
    classes: ['modern-chimera-d20', 'character-sheet'],
    tag: 'form',
    position: { width: 560, height: 480 },
    form: { submitOnChange: true, closeOnSubmit: false },
  };

  static override PARTS = {
    profile: { template: 'systems/modern-chimera-d20/templates/character-sheet.hbs' },
  };

  protected override async _prepareContext(
    options: Parameters<foundry.applications.sheets.ActorSheetV2['_prepareContext']>[0],
  ) {
    return {
      ...(await super._prepareContext(options)),
      actor: this.actor,
      system: this.actor.system,
      editable: this.isEditable,
    };
  }
}
