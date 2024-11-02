import { useState } from 'react'

const Header = ({ Text }) => {
  return (
    <div>
      <h1>
        {Text}
      </h1>
    </div>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + bad + neutral

  const StatisticLine = ({ text, value }) => {
    return (
      <tr>
        <td>
          {text}
        </td>
        <td>
          {value}
        </td>
      </tr>

    )
  }
  if (all === 0) {
    return (
      <div>
        <p>No feedBack given</p>
      </div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="average" value={1 / (all / (good - bad))} />
          <StatisticLine text="positive" value={good / all * 100} />
        </tbody>

      </table>

    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header Text='Give feedBack' />

      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <Header Text='Statisctics' />

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App