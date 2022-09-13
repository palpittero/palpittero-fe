import api from '@/services/api'

const RESOURCE_URI = '/users'

const fetchUsers = () => api.get(RESOURCE_URI)

const fetchUserById = (id) => api.get(`${RESOURCE_URI}/${id}`)

const createUser = (user) => api.post(`${RESOURCE_URI}`, user)

const updateUser = (user) => api.put(`${RESOURCE_URI}/${user.id}`, user)

const deleteUsers = (ids) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUsers
}
