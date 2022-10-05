import { HTTP_MULTIPART_CONFIG } from '@/constants'
import { parseMultiPartFormData } from '@/helpers/form'
import { objectToSearchParams } from '@/helpers/utils'
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

const fetchUsers = ({ league, status }) => {
  const searchParams = objectToSearchParams({ status })

  return api.get(`${RESOURCE_URI}/${league.id}/users${searchParams}`)
}

const fetchChampionships = (id) =>
  api.get(`${RESOURCE_URI}/${id}/championships`)

const fetchMyLeagues = ({ status } = {}) => {
  const searchParams = objectToSearchParams({ status })

  return api.get(`${RESOURCE_URI}/my${searchParams}`)
}

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
