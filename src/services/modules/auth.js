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

export default {
  authenticate,
  refreshToken,
  fetchLoggedUser,
  signUp,
  recoverPassword,
  activateAccount
}
