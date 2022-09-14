import api from '@/services/api'

const RESOURCE_URI = '/users-leagues'

const inviteUsers = ({ leagueId, users }) =>
  api.post(`${RESOURCE_URI}/invite`, { leagueId, users })

const acceptInvitation = (token) =>
  api.post(`${RESOURCE_URI}/acceptInvitation/${token}`)

const deleteUser = ({ leagueId, userId }) =>
  api.delete(`${RESOURCE_URI}/${leagueId}/${userId}`, { leagueId, userId })

export default {
  inviteUsers,
  acceptInvitation,
  deleteUser
}
