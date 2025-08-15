import api from '@/services/api'

const RESOURCE_URI = '/matches'

const fetchMatches = (query = {}) => api.get(RESOURCE_URI, { params: query })

const fetchMatchById = (id: number) => api.get(`${RESOURCE_URI}/${id}`)

const createMatch = (match: any) => api.post(`${RESOURCE_URI}`, match)

const createMatches = (match: any) => api.post(`${RESOURCE_URI}/create-many`, match)

const updateMatch = (match: any) => api.put(`${RESOURCE_URI}/${match.id}`, match)

const deleteMatch = (match: any) => api.delete(`${RESOURCE_URI}/${match.id}`)

const deleteMatches = (ids: number[]) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchMatches,
  fetchMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  deleteMatches,
  createMatches,
}
