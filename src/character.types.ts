export type CharacterState = "correct" | "incorrect" | "upcoming";

export type Character = { text: string; state: CharacterState };
