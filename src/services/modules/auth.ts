import api from '@/services/api'

const RESOURCE_URI = '/auth'

const authenticate = ({ email, password }: { email: string; password: string }): Promise<any> =>
  api.post(`${RESOURCE_URI}/authenticate`, { email, password })

const refreshToken = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) => api.post(`${RESOURCE_URI}/refreshToken`, { accessToken, refreshToken })

const fetchLoggedUser = () => api.get(`${RESOURCE_URI}/me`)

const signUp = ({
  name,
  email,
  password,
  passwordConfirmation,
}: {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}) =>
  api.post(`${RESOURCE_URI}/signUp`, {
    name,
    email,
    password,
    passwordConfirmation,
  })

const recoverPassword = ({ email }: { email: string }) =>
  api.post(`${RESOURCE_URI}/recoverPassword`, { email })

const activateAccount = (token: string) => api.post(`${RESOURCE_URI}/activate/${token}`)

const resendActivation = ({ email }: { email: string }) =>
  api.post(`${RESOURCE_URI}/resendActivation`, { email })

const resetPassword = ({
  token,
  password,
  passwordConfirmation,
}: {
  token: string
  password: string
  passwordConfirmation: string
}) =>
  api.put(`${RESOURCE_URI}/resetPassword`, {
    token,
    password,
    passwordConfirmation,
  })

const validateToken = (token: string) => api.get(`${RESOURCE_URI}/validateToken/${token}`)

const updatePassword = ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string
  newPassword: string
}) => api.post(`${RESOURCE_URI}/updatePassword`, { currentPassword, newPassword })

export default {
  authenticate,
  refreshToken,
  fetchLoggedUser,
  signUp,
  recoverPassword,
  activateAccount,
  resetPassword,
  validateToken,
  updatePassword,
  resendActivation,
}
