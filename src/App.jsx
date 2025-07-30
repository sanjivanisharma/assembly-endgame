import { languages } from "./languages"

export default function App() {

  const languageElements = languages.map((lang) => (
    <span
      style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      className="chip"
      key={lang.name}
    >{lang.name}</span>
  ))

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
    </main>
  )
}
