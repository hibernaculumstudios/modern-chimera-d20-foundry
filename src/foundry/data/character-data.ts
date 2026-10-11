/** Persistent profile only; no game mechanics have been selected yet. */
function characterSchema() {
  return {
    biography: new foundry.data.fields.StringField({
      required: true,
      nullable: false,
      blank: true,
      initial: '',
    }),
  };
}

type CharacterSchema = ReturnType<typeof characterSchema>;

export class CharacterData extends foundry.abstract.TypeDataModel<
  CharacterSchema,
  Actor.Implementation
> {
  static override defineSchema() {
    return characterSchema();
  }
}

declare global {
  interface DataModelConfig {
    Actor: { character: typeof CharacterData };
  }
}
