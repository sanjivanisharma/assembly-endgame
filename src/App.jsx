import { useState } from "react"

import { languages } from "./languages"

import clsx from "clsx"

export default function App() {
  // State values
  const [currentWord, setCurrentWord] = useState("react")
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const wrongGuessCount = guessedLetters.reduce((count, letter) => {
    return !currentWord.includes(letter) ? count + 1 : count
  }, 0)

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

  const wordElements = currentWord.split("").map((letter, index) => (
    <span key={index}>{guessedLetters.includes(letter) ? letter.toUpperCase() : ""}</span>
  ))

  const keyboardElements = alphabet.split("").map((alphabet) => {
    const isGuessed = guessedLetters.includes(alphabet)
    const isCorrect = isGuessed && currentWord.includes(alphabet)
    const isWrong = isGuessed && !currentWord.includes(alphabet)

    return <button
      className={clsx({ "correct": isCorrect, "wrong": isWrong })}
      onClick={() => addGuessedLetters(alphabet)}
      key={alphabet}
    >{alphabet.toUpperCase()}</button>
  })

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className="game-status">
        <h2>You win!</h2>
        <p>Well done!🎉</p>
      </section>
      <section className="language-chips">
        {languageElements}
      </section>
      <section className="word">
        {wordElements}
      </section>
      <section className="keyboard">
        {keyboardElements}
      </section>
      <button className="new-game">New Game</button>
    </main>
  )
}
