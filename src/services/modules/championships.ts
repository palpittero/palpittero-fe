import api from '@/services/api'
import type { iChampionship, iChampionshipGroup, iChampionshipRound, iTeam } from '@/types'

const RESOURCE_URI = '/championships'

const fetchChampionships = (): Promise<iChampionship[]> => api.get(RESOURCE_URI)

const fetchChampionshipById = (id: number): Promise<iChampionship> =>
  api.get(`${RESOURCE_URI}/${id}`)

const fetchRounds = (id: number): Promise<iChampionshipRound[]> =>
  api.get(`${RESOURCE_URI}/${id}/rounds`)

const fetchTeams = (id: number): Promise<iTeam[]> => api.get(`${RESOURCE_URI}/${id}/teams`)

const fetchGroups = (id: number): Promise<iChampionshipGroup[]> =>
  api.get(`${RESOURCE_URI}/${id}/groups`)

const createChampionship = (championship: any) => api.post(`${RESOURCE_URI}`, championship)

const updateChampionship = (championship: any) =>
  api.put(`${RESOURCE_URI}/${championship.id}`, championship)

const deleteChampionship = (championship: any) => api.delete(`${RESOURCE_URI}/${championship.id}`)

const deleteChampionships = (ids: number[]) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchChampionships,
  fetchRounds,
  fetchGroups,
  fetchChampionshipById,
  createChampionship,
  updateChampionship,
  deleteChampionship,
  deleteChampionships,
  fetchTeams,
}
