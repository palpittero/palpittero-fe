import api from '@/services/api'

const RESOURCE_URI = '/leagues'

const fetchLeagues = () => api.get(RESOURCE_URI)

const fetchLeagueById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createLeague = (league) => api.post(`${RESOURCE_URI}`, league)

const updateLeague = (league) => api.put(`${RESOURCE_URI}/${league.id}`, league)

const deleteLeague = (league) => api.delete(`${RESOURCE_URI}/${league.id}`)

const fetchUsers = (league) => api.get(`${RESOURCE_URI}/${league.id}/users`)

const fetchChampionships = (id) =>
  api.get(`${RESOURCE_URI}/${id}/championships`)

const fetchMyLeagues = () => api.get(`${RESOURCE_URI}/my`)

const fetchPublicLeagues = () => api.get(`${RESOURCE_URI}/public`)

const deleteLeagues = (ids) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchLeagues,
  fetchLeagueById,
  createLeague,
  updateLeague,
  deleteLeague,
  deleteLeagues,
  fetchUsers,
  fetchChampionships,
  fetchMyLeagues,
  fetchPublicLeagues
}
