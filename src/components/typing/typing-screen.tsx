"use client";

import { useState } from "react";
import Timer from "./timer";
import { getWordlist } from "@/lib/wordlist";

interface TypingScreenProps {
  initialSeconds: number;
  initialWordlist: string[];
}

export default function TypingScreen({ initialSeconds, initialWordlist }: TypingScreenProps) {
  const [wordlist, setWordlist] = useState(initialWordlist);

  const onReset = () => {
    setWordlist(getWordlist(initialWordlist.length));
  };

  return (
    <section>
      <Timer initialSeconds={initialSeconds} onReset={onReset} />
      <p>{wordlist.join(" ")}</p>
    </section>
  );
}
