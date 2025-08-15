import api from '@/services/api'

const RESOURCE_URI = '/users-leagues'

const inviteUsers = ({ leagueId, users }: { leagueId: number; users: any }) =>
  api.post(`${RESOURCE_URI}/invite`, { leagueId, users })

const acceptInvitation = (token: string) => api.post(`${RESOURCE_URI}/acceptInvitation/${token}`)

const deleteUser = ({ leagueId, userId }: { leagueId: number; userId: number }) =>
  // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
  api.delete(`${RESOURCE_URI}/${leagueId}/${userId}`, { leagueId, userId })

const updateInvitations = (invitations: any) =>
  api.post(`${RESOURCE_URI}/updateInvitations`, { invitations })

const joinLeague = (leagueId: number) => api.post(`${RESOURCE_URI}/join/${leagueId}`)

const approveUsers = ({ leagueId, users }: { leagueId: number; users: any }) =>
  api.post(`${RESOURCE_URI}/approveUsers/${leagueId}`, { users })

export default {
  inviteUsers,
  acceptInvitation,
  deleteUser,
  updateInvitations,
  joinLeague,
  approveUsers,
}
