import type {
  iChampionship,
  iChampionshipGuess,
  iGuess,
  iMatchGuess,
  iUserChampionshipGuess,
} from '@/types'

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

const parseChampionshipsGuesses = (guesses: iChampionshipGuess[]): iUserChampionshipGuess[] => {
  const championships = guesses.reduce(
    // @ts-ignore
    (acc: Record<string, iUserChampionshipGuess>, guess: iChampionshipGuess) => {
      const { championship } = guess
      const championshipId = String(championship?.id)
      const userId = Number(guess.user?.id)

      const guesses = acc[championshipId]?.users?.[userId]?.guesses || []

      return {
        ...acc,
        [championshipId]: {
          ...championship,
          users: {
            ...acc[championshipId]?.users,
            [userId]: {
              ...guess.user,
              guesses: [...guesses, guess],
            },
          },
        },
      }
    },
    {} as Record<string, iUserChampionshipGuess>,
  )

  return Object.values(championships as unknown as Record<string, iUserChampionshipGuess>).map(
    ({ users, ...championship }) => ({
      ...championship,
      users: Object.values(users),
    }),
  )
}

const parseChampionshipGuesses = (championshipGuesses: iChampionshipGuess[]) =>
  championshipGuesses.reduce(
    (acc: Record<number, iChampionshipGuess>, championshipGuess: iChampionshipGuess) => ({
      ...acc,
      [championshipGuess.position]: championshipGuess,
    }),
    {},
  )

const initChampionshipPositionsGuesses = ({
  championshipId,
  leagueId,
  userId,
  championshipGuesses,
}: {
  championshipId: number
  leagueId: number
  userId: number
  championshipGuesses: iChampionshipGuess[]
}): Record<number, iChampionshipGuess> => {
  return {
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
    ...parseChampionshipGuesses(championshipGuesses),
  }
}

const prepareChampionshipsGuesses = (championshipsGuesses: Record<number, iChampionshipGuess>) =>
  Object.values(championshipsGuesses).reduce(
    (acc: iChampionshipGuess[], championshipGuessesMap: Record<number, iChampionshipGuess>) => {
      const championshipGuesses = Object.values(championshipGuessesMap).map(
        (championshipGuess: any) => ({
          ...championshipGuess,
          team: {
            id: championshipGuess.teamId,
          },
        }),
      )

      return [...acc, ...championshipGuesses]
    },
    [],
  )

const hasInvalidMatchesGuesses = ({
  championships,
  matchesGuesses,
}: {
  championships: iChampionship[]
  matchesGuesses: iMatchGuess[]
}) => {
  // Check if there are any championships that enable guesses but have no position guesses
  const hasEnabledChampionships = championships.some(({ enableGuesses }) => !!enableGuesses)

  if (hasEnabledChampionships) return false

  if (matchesGuesses.length === 0) {
    return true
  }

  // Check if any guess has invalid data
  return matchesGuesses.some((guess: any) => {
    const homeTeamRegularTimeGoals = parseInt(String(guess.homeTeamRegularTimeGoals))
    const awayTeamRegularTimeGoals = parseInt(String(guess.awayTeamRegularTimeGoals))

    const hasInvalidRegularTimeGoals =
      isNaN(homeTeamRegularTimeGoals) || isNaN(awayTeamRegularTimeGoals)

    if (hasInvalidRegularTimeGoals) return true

    // Check penalties validation for draw games
    const isDraw = homeTeamRegularTimeGoals === awayTeamRegularTimeGoals

    const isPenaltiesRound =
      guess.match?.round?.type === 'penalties' || guess.match?.round?.type === 'extraTime'

    if (isDraw && isPenaltiesRound) {
      const homeTeamPenaltiesTimeGoals = parseInt(String(guess.homeTeamPenaltiesTimeGoals))
      const awayTeamPenaltiesTimeGoals = parseInt(String(guess.awayTeamPenaltiesTimeGoals))

      const hasInvalidPenaltiesGoals =
        isNaN(homeTeamPenaltiesTimeGoals) || isNaN(awayTeamPenaltiesTimeGoals)

      if (hasInvalidPenaltiesGoals) return true

      return homeTeamPenaltiesTimeGoals === awayTeamPenaltiesTimeGoals
    }
  })
}

export {
  parseMatchesGuesses,
  parseChampionshipsGuesses,
  parseChampionshipGuesses,
  initChampionshipPositionsGuesses,
  prepareChampionshipsGuesses,
  hasInvalidMatchesGuesses,
}
