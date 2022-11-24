import { objectToSearchParams } from '@/helpers/utils'
import api from '@/services/api'

const RESOURCE_URI = '/dashboard'

const fetchGeneralStats = () => api.get(`${RESOURCE_URI}/general-stats`)

const fetchUnprocessedGuesses = ({ leagueId, championshipId } = {}) => {
  const searchParams = objectToSearchParams({ leagueId, championshipId })

  return api.get(`${RESOURCE_URI}/unprocessed-guesses${searchParams}`)
}

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses
}
