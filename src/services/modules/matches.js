import api from '@/services/api'

const RESOURCE_URI = '/matches'

const fetchMatches = (query = {}) => api.get(RESOURCE_URI, { params: query })

const fetchMatchById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createMatch = (match) => api.post(`${RESOURCE_URI}`, match)

const updateMatch = (match) => api.put(`${RESOURCE_URI}/${match.id}`, match)

const deleteMatch = (match) => api.delete(`${RESOURCE_URI}/${match.id}`)

export default {
  fetchMatches,
  fetchMatchById,
  createMatch,
  updateMatch,
  deleteMatch
}
