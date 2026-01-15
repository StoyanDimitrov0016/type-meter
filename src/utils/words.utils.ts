import { WORDLIST } from "@/constants/wordlist.constants";

export function getWords(count: number): string[] {
  const words: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * WORDLIST.length);
    words[i] = WORDLIST[randomIndex];
  }

  return words;
}
