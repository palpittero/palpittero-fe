import api from '@/services/api'

const RESOURCE_URI = '/dashboard'

const fetchGeneralStats = () => api.get(`${RESOURCE_URI}/general-stats`)

const fetchUnprocessedGuesses = () =>
  api.get(`${RESOURCE_URI}/unprocessed-guesses`)

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses
}
