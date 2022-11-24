import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./assets/HangmanDrawing";
import { HangmanWord } from "./assets/HangmanWord";
import { Keyboard } from "./assets/Keyboard";
import words from "./wordList.json";

function App() {
  function getWord() {
    return words[Math.floor(Math.random() * words.length)];
  }
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guessLetters, setGussedLetters] = useState<string[]>([]);

  const incorrectLetters = guessLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessLetters.includes(letter));
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessLetters.includes(letter) || isLoser || isWinner) return;
      setGussedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessLetters, isLoser, isWinner]
  );

  useEffect(() => {
    const Handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!e.key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", Handler);
    return () => {
      document.removeEventListener("keypress", Handler);
    };
  }, []);

  useEffect(() => {
    const Handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;
      e.preventDefault();
      setGussedLetters([]);
      setWordToGuess(getWord());
    };
    document.addEventListener("keypress", Handler);
    return () => {
      document.removeEventListener("keypress", Handler);
    };
  }, []);
  return (
    <>
      <div
        style={{
          maxWidth: "880px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          {isWinner && "Winner! -Refresh to Try again"}
          {isLoser && "Nice Try! -Refresh to Try again"}
        </div>
        <HangmanDrawing numberofGuessess={incorrectLetters.length} />
        <HangmanWord
          guessLetters={guessLetters}
          wordToGuess={wordToGuess}
          reveal={isLoser}
        />

        <div style={{ alignSelf: "stretch", display: "block" }}>
          <Keyboard
            disabled={isLoser || isWinner}
            activeLetters={guessLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>
    </>
  );
}

export default App;
