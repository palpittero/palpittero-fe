import api from '@/services/api'

const RESOURCE_URI = '/championships'

const fetchChampionships = () => api.get(RESOURCE_URI)

const fetchChampionshipById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const fetchRounds = (id) => api.get(`${RESOURCE_URI}/${id}/rounds`)

const fetchTeams = (id) => api.get(`${RESOURCE_URI}/${id}/teams`)

const createChampionship = (championship) =>
  api.post(`${RESOURCE_URI}`, championship)

const updateChampionship = (championship) =>
  api.put(`${RESOURCE_URI}/${championship.id}`, championship)

const deleteChampionship = (championship) =>
  api.delete(`${RESOURCE_URI}/${championship.id}`)

export default {
  fetchChampionships,
  fetchRounds,
  fetchChampionshipById,
  createChampionship,
  updateChampionship,
  deleteChampionship,
  fetchTeams
}
