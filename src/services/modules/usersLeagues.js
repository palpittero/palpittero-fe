import api from '@/services/api'

const RESOURCE_URI = '/users-leagues'

const inviteUsers = ({ leagueId, users }) =>
  api.post(`${RESOURCE_URI}/invite`, { leagueId, users })

const approveUser = ({ leagueId, userId }) =>
  api.post(`${RESOURCE_URI}/approve`, { leagueId, userId })

const deleteUser = ({ leagueId, userId }) =>
  api.delete(`${RESOURCE_URI}/${leagueId}/${userId}`, { leagueId, userId })

export default {
  inviteUsers,
  approveUser,
  deleteUser
}
