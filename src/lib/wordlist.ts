import { WORDS } from "./words";

export function getWordlist(length: number) {
  const wordlist: string[] = [];

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * WORDS.length);
    wordlist.push(WORDS[index]);
  }

  return wordlist;
}
