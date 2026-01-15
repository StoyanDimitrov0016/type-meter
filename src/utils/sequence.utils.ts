import { Character } from "@/character.types";

export function buildSequence(words: string[]): Character[] {
  return Array.from(words.join(" ")).map((letter) => ({
    text: letter,
    state: "upcoming",
  }));
}

export function validateSequence(sequence: Character[], input: string): Character[] {
  const result: Character[] = [];

  for (let i = 0; i < input.length; i++) {
    const letter = input[i];
    const char = sequence[i];

    if (letter !== char.text) {
      result[i] = { text: char.text, state: "incorrect" };
      continue;
    }

    result[i] = { text: char.text, state: "correct" };
  }

  for (let i = input.length; i < sequence.length; i++) {
    const char = sequence[i];
    result[i] = { text: char.text, state: "upcoming" };
  }

  return result;
}
