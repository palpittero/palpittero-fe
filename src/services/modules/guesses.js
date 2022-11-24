import api from '@/services/api'

const RESOURCE_URI = '/guesses'

const fetchGuesses = (params = {}) => api.get(RESOURCE_URI, { params })

const fetchMyGuesses = (params = {}) =>
  api.get(`${RESOURCE_URI}/my`, { params })

const registerGuesses = ({ matchesGuesses, championshipsGuesses }) =>
  api.post(`${RESOURCE_URI}/register`, { matchesGuesses, championshipsGuesses })

const processGuesses = ({ leagueId, championshipId } = {}) =>
  api.post(`${RESOURCE_URI}/process`, { leagueId, championshipId })

export default {
  fetchGuesses,
  fetchMyGuesses,
  registerGuesses,
  processGuesses
}
