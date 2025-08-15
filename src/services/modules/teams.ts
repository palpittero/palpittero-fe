import { HTTP_MULTIPART_CONFIG } from '@/constants'
import { parseMultiPartFormData } from '@/helpers/form'
import api from '@/services/api'

const RESOURCE_URI = '/teams'

const fetchTeams = (query = {}) =>
  api.get(RESOURCE_URI, {
    params: query,
  })

const fetchTeamById = (id: number) => api.get(`${RESOURCE_URI}/${id}`)

const createTeam = (team: any) => {
  const formData = parseMultiPartFormData({ data: team, ignore: ['badge'] })
  // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
  return api.post(`${RESOURCE_URI}`, formData, HTTP_MULTIPART_CONFIG)
}

const updateTeam = (team: any) => {
  const formData = parseMultiPartFormData({ data: team, ignore: ['badge'] })
  // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
  return api.put(`${RESOURCE_URI}/${team.id}`, formData, HTTP_MULTIPART_CONFIG)
}

const deleteTeam = (team: any) => api.delete(`${RESOURCE_URI}/${team.id}`)

const deleteTeams = (ids: number[]) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

const fetchCountries = () => api.get(`${RESOURCE_URI}/countries`)

export default {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  deleteTeams,
  fetchCountries,
}
