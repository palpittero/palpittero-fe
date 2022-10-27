const parseGuessesChampionships = (guesses) => {
  const championships = guesses.reduce((acc, guess) => {
    const { championship } = guess.match.round

    return {
      ...acc,
      [championship.id]: {
        ...championship,
        guesses: [...(acc[championship.id]?.guesses || []), guess]
      }
    }
  }, {})

  return Object.values(championships)
}

export { parseGuessesChampionships }
