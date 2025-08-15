import api from '@/services/api'

const RESOURCE_URI = '/guesses'

const fetchGuesses = (params = {}) => api.get(RESOURCE_URI, { params })

const fetchMyGuesses = (params = {}) => api.get(`${RESOURCE_URI}/my`, { params })

const registerGuesses = async ({
  matchesGuesses,
  championshipsGuesses,
}: {
  matchesGuesses: any
  championshipsGuesses: any
}) => {
  const output = await api.post(`${RESOURCE_URI}/register`, {
    matchesGuesses,
    championshipsGuesses,
  })
  console.log({ output })
  return output
}

const processGuesses = ({
  leagueId,
  championshipId,
}: { leagueId?: number; championshipId?: number } = {}) =>
  api.post(`${RESOURCE_URI}/process`, { leagueId, championshipId })

const copyGuesses = ({
  sourceLeagueId,
  targetLeagueId,
  championshipsIds,
  copyMatchesGuesses,
  copyChampionshipsGuesses,
}: {
  sourceLeagueId: number
  targetLeagueId: number
  championshipsIds: number[]
  copyMatchesGuesses: boolean
  copyChampionshipsGuesses: boolean
}) =>
  api.post(`${RESOURCE_URI}/copy`, {
    sourceLeagueId,
    targetLeagueId,
    championshipsIds,
    copyMatchesGuesses,
    copyChampionshipsGuesses,
  })

export default {
  fetchGuesses,
  fetchMyGuesses,
  registerGuesses,
  processGuesses,
  copyGuesses,
}
