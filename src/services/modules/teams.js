import api from '@/services/api'

const RESOURCE_URI = '/teams'

const fetchTeams = (query = {}) =>
  api.get(RESOURCE_URI, {
    params: query
  })

const fetchTeamById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createTeam = (team) => api.post(`${RESOURCE_URI}`, team)

const updateTeam = (team) => api.put(`${RESOURCE_URI}/${team.id}`, team)

const deleteTeam = (team) => api.delete(`${RESOURCE_URI}/${team.id}`)

export default {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam
}
