import type { iChampionship, iGuess } from '@/types'

const parseMatchesGuesses = (guesses: iGuess[]): iChampionship[] => {
  const championships = guesses.reduce(
    // @ts-ignore
    (acc: Record<string, iChampionship>, guess: iGuess) => {
      const { championship } = guess?.match?.round || guess
      const championshipId = `${championship.id}`

      return {
        ...acc,
        [championshipId]: {
          ...championship,
          guesses: [...(acc[championshipId]?.guesses || []), guess],
        },
      }
    },
    {} as Record<string, iChampionship>,
  )

  return Object.values(championships) as iChampionship[]
}

const parseChampionshipsGuesses = (guesses: iGuess[]) => {
  const championships = guesses.reduce((acc: Record<string, iChampionship>, guess: iGuess) => {
    const { championship } = guess
    const guesses = acc[championship.id!]?.users?.[guess.user.id]?.guesses || []

    return {
      ...acc,
      [championship.id!]: {
        ...championship,
        users: {
          ...acc[championship.id!]?.users,
          [guess.user.id!]: {
            ...guess.user,
            guesses: [...guesses, guess],
          },
        },
      },
    }
  }, {})

  return Object.values(championships).map(({ users, ...championship }) => ({
    ...championship,
    users: Object.values(users),
  }))
}

const parseChampionshipGuesses = (championshipGuesses) =>
  championshipGuesses.reduce(
    (acc, championshipGuess) => ({
      ...acc,
      [championshipGuess.position]: championshipGuess,
    }),
    {},
  )

const getChampionshipGuessesInitialValues = ({ championshipId, leagueId, userId }) => ({
  1: {
    championshipId,
    leagueId,
    userId,
    team: null,
    teamId: null,
    position: 1,
  },
  2: {
    championshipId,
    leagueId,
    userId,
    team: null,
    teamId: null,
    position: 2,
  },
})

export {
  parseMatchesGuesses,
  parseChampionshipsGuesses,
  parseChampionshipGuesses,
  getChampionshipGuessesInitialValues,
}
