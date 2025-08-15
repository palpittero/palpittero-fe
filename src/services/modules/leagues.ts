import { HTTP_MULTIPART_CONFIG } from '@/constants'
import { parseMultiPartFormData } from '@/helpers/form'
import { objectToSearchParams } from '@/helpers/utils'
import api from '@/services/api'

const RESOURCE_URI = '/leagues'

const fetchLeagues = () => api.get(RESOURCE_URI)

const fetchLeagueById = (id: number) => api.get(`${RESOURCE_URI}/${id}`)

const createLeague = (league: any) => {
  const formData = parseMultiPartFormData({ data: league, ignore: ['badge'] })
  // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
  return api.post(`${RESOURCE_URI}`, formData, HTTP_MULTIPART_CONFIG)
}

const updateLeague = (league: any) => {
  const formData = parseMultiPartFormData({ data: league, ignore: ['badge'] })
  return api.put(
    `${RESOURCE_URI}/${league.id}`,
    formData,
    // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
    HTTP_MULTIPART_CONFIG,
  )
}

const deleteLeague = (league: any) => api.delete(`${RESOURCE_URI}/${league.id}`)

const fetchUsers = ({ league, status }: { league: any; status: string }) => {
  const searchParams = objectToSearchParams({ status })

  return api.get(`${RESOURCE_URI}/${league.id}/users${searchParams}`)
}

const fetchChampionships = (id: number) => api.get(`${RESOURCE_URI}/${id}/championships`)

const fetchMyLeagues = ({ status }: { status: string }) => {
  const searchParams = objectToSearchParams({ status })

  return api.get(`${RESOURCE_URI}/my${searchParams}`)
}

const fetchPublicLeagues = () => api.get(`${RESOURCE_URI}/public`)

const deleteLeagues = (ids: number[]) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

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
  fetchPublicLeagues,
}
