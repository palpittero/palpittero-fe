import { objectToSearchParams } from '@/helpers/utils'
import api from '@/services/api'

const RESOURCE_URI = '/championships-guesses'

const fetchChampionshipsGuesses = ({
  championshipId,
  leagueId,
  userId,
}: {
  championshipId: number
  leagueId: number
  userId: number
}) => {
  const searchParams = objectToSearchParams({ userId })

  return api.get(`${RESOURCE_URI}/${championshipId}/${leagueId}${searchParams}`)
}

const createChampionshipGuesses = (
  championshipGuesses: any,
  {
    championshipId,
    leagueId,
    userId,
  }: { championshipId: number; leagueId: number; userId: number },
) => api.post(`${RESOURCE_URI}/${championshipId}/${leagueId}/${userId}`, championshipGuesses)

export default {
  fetchChampionshipsGuesses,
  createChampionshipGuesses,
}
