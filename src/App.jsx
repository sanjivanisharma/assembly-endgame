import { useState } from "react"

import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"

import clsx from "clsx"
import Confetti from "react-confetti"

export default function App() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const wrongGuessCount = guessedLetters.reduce((count, letter) => {
    return !currentWord.includes(letter) ? count + 1 : count
  }, 0)
  const numGuessesLeft = languages.length - 1
  const isGameWon = (currentWord.split("").every(letter => guessedLetters.includes(letter)))
  const isGameLost = (wrongGuessCount >= numGuessesLeft)
  const isGameOver = isGameLost || isGameWon
  const lastGuess = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuess && !currentWord.includes(lastGuess)

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetters(letter) {
    setGuessedLetters(prevLetters => (
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    ))
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount

    return <span
      style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      className={clsx("chip", isLanguageLost && "lost")}
      key={lang.name}
    >{lang.name}</span>
  })

  const wordElements = currentWord.split("").map((letter, index) => {
    const showLetter = isGameLost || guessedLetters.includes(letter)
    const missedLetterClass = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return <span
      key={index}
      className={missedLetterClass}
    >
      {showLetter ? letter.toUpperCase() : ""}
    </span>
  })

  const keyboardElements = alphabet.split("").map((alphabet) => {
    const isGuessed = guessedLetters.includes(alphabet)
    const isCorrect = isGuessed && currentWord.includes(alphabet)
    const isWrong = isGuessed && !currentWord.includes(alphabet)

    return <button
      className={clsx({ "correct": isCorrect, "wrong": isWrong })}
      onClick={() => addGuessedLetters(alphabet)}
      key={alphabet}
      disabled={isGameOver}
      aria-disabled={guessedLetters.includes(alphabet)}
      aria-label={`Letter ${alphabet}`}
    >
      {alphabet.toUpperCase()}
    </button>
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p
          className="farwell-message"
        >{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done!🎉</p>
        </>
      )
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }

    return null
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <main>
      {isGameWon && <Confetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section
        className={
          clsx("game-status",
            {
              "game-won": isGameWon,
              "game-lost": isGameLost,
              "farwell": !isGameOver && isLastGuessIncorrect
            })}
        aria-live="polite"
        role="status"
      >
        {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <section className="word">
        {wordElements}
      </section>
      {/* Combined visually-hidden aria-live region for status updates */}
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuess) ?
            `Correct! The letter ${lastGuess} is in the word.` :
            `Sorry, the letter ${lastGuess} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>

      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>

      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}
