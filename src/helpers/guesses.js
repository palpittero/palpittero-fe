const parseMatchesGuesses = (guesses) => {
  const championships = guesses.reduce((acc, guess) => {
    const { championship } = guess?.match?.round || guess

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

const parseChampionshipsGuesses = (guesses) => {
  const championships = guesses.reduce((acc, guess) => {
    const { championship } = guess
    const guesses = acc[championship.id]?.users?.[guess.userId]?.guesses || []

    return {
      ...acc,
      [championship.id]: {
        ...championship,
        users: {
          ...acc[championship.id]?.users,
          [guess.userId]: {
            ...guess.user,
            guesses: [...guesses, guess]
          }
        }
      }
    }
  }, {})

  return Object.values(championships).map(({ users, ...championship }) => ({
    ...championship,
    users: Object.values(users)
  }))
}

const parseChampionshipGuesses = (championshipGuesses) =>
  championshipGuesses.reduce(
    (acc, championshipGuess) => ({
      ...acc,
      [championshipGuess.position]: championshipGuess
    }),
    {}
  )

const getChampionshipGuessesInitialValues = ({
  championshipId,
  leagueId,
  userId
}) => ({
  1: {
    championshipId,
    leagueId,
    userId,
    team: null,
    teamId: null,
    position: 1
  },
  2: {
    championshipId,
    leagueId,
    userId,
    team: null,
    teamId: null,
    position: 2
  }
})

export {
  parseMatchesGuesses,
  parseChampionshipsGuesses,
  parseChampionshipGuesses,
  getChampionshipGuessesInitialValues
}
