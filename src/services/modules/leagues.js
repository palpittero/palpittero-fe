import { HTTP_MULTIPART_CONFIG } from '@/constants'
import { parseMultiPartFormData } from '@/helpers/form'
import api from '@/services/api'

const RESOURCE_URI = '/leagues'

const fetchLeagues = () => api.get(RESOURCE_URI)

const fetchLeagueById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createLeague = (league) => {
  const formData = parseMultiPartFormData({ data: league, ignore: ['badge'] })
  return api.post(`${RESOURCE_URI}`, formData, HTTP_MULTIPART_CONFIG)
}

const updateLeague = (league) => {
  const formData = parseMultiPartFormData({ data: league, ignore: ['badge'] })
  return api.put(
    `${RESOURCE_URI}/${league.id}`,
    formData,
    HTTP_MULTIPART_CONFIG
  )
}

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
