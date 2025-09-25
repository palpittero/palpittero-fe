import api from '@/services/api'
import type { iCopyGuesses, iGuess } from '@/types'

const RESOURCE_URI = '/guesses'

const fetchGuesses = (params = {}) => api.get(RESOURCE_URI, { params })

const fetchMyGuesses = (params = {}): Promise<iGuess[]> => api.get(`${RESOURCE_URI}/my`, { params })

const registerGuesses = async ({
  matchesGuesses,
  championshipsGuesses,
}: {
  matchesGuesses: any
  championshipsGuesses: any
}) =>
  api.post(`${RESOURCE_URI}/register`, {
    matchesGuesses,
    championshipsGuesses,
  })

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
}: iCopyGuesses) =>
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
