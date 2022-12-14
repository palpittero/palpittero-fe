import api from '@/services/api'

const RESOURCE_URI = '/matches'

const fetchMatches = (query = {}) => api.get(RESOURCE_URI, { params: query })

const fetchMatchById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createMatch = (match) => api.post(`${RESOURCE_URI}`, match)

const createMatches = (match) => api.post(`${RESOURCE_URI}/create-many`, match)

const updateMatch = (match) => api.put(`${RESOURCE_URI}/${match.id}`, match)

const deleteMatch = (match) => api.delete(`${RESOURCE_URI}/${match.id}`)

const deleteMatches = (ids) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchMatches,
  fetchMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  deleteMatches,
  createMatches
}
