import { objectToSearchParams } from '@/helpers/utils'
import api from '@/services/api'
import type { iDashboardStats } from '@/types'
import type { iUnprocessedGuess } from '@/types/guesses'

const RESOURCE_URI = '/dashboard'

const fetchGeneralStats = (): Promise<iDashboardStats> => api.get(`${RESOURCE_URI}/general-stats`)

const fetchUnprocessedGuesses = ({
  leagueId,
  championshipId,
}: { leagueId?: number; championshipId?: number } = {}): Promise<iUnprocessedGuess> => {
  const searchParams = objectToSearchParams({ leagueId, championshipId })

  return api.get(`${RESOURCE_URI}/unprocessed-guesses${searchParams}`)
}

export default {
  fetchGeneralStats,
  fetchUnprocessedGuesses,
}
