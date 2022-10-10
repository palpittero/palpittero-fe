import api from '@/services/api'

const RESOURCE_URI = '/auth'

const authenticate = ({ email, password }) =>
  api.post(`${RESOURCE_URI}/authenticate`, { email, password })

const refreshToken = ({ accessToken, refreshToken }) =>
  api.post(`${RESOURCE_URI}/refreshToken`, { accessToken, refreshToken })

const fetchLoggedUser = () => api.get(`${RESOURCE_URI}/me`)

const signUp = ({ name, email, password, passwordConfirmation }) =>
  api.post(`${RESOURCE_URI}/signUp`, {
    name,
    email,
    password,
    passwordConfirmation
  })

const recoverPassword = ({ email }) =>
  api.post(`${RESOURCE_URI}/recoverPassword`, { email })

const activateAccount = (token) => api.post(`${RESOURCE_URI}/activate/${token}`)

const resetPassword = ({ token, password, passwordConfirmation }) =>
  api.put(`${RESOURCE_URI}/resetPassword`, {
    token,
    password,
    passwordConfirmation
  })

const validateToken = (token) =>
  api.get(`${RESOURCE_URI}/validateToken/${token}`)

const updatePassword = ({ currentPassword, newPassword }) =>
  api.post(`${RESOURCE_URI}/updatePassword`, { currentPassword, newPassword })

export default {
  authenticate,
  refreshToken,
  fetchLoggedUser,
  signUp,
  recoverPassword,
  activateAccount,
  resetPassword,
  validateToken,
  updatePassword
}
