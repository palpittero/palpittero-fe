import api from '@/services/api'

const RESOURCE_URI = '/championships'

const fetchChampionships = () => api.get(RESOURCE_URI)

const fetchChampionshipById = (id: number) => api.get(`${RESOURCE_URI}/${id}`)

const fetchRounds = (id: number) => api.get(`${RESOURCE_URI}/${id}/rounds`)

const fetchTeams = (id: number) => api.get(`${RESOURCE_URI}/${id}/teams`)

const fetchGroups = (id: number) => api.get(`${RESOURCE_URI}/${id}/groups`)

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
