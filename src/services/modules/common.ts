import type { iStatus } from '@/types'
import api from '@/services/api'

const updateStatus = ({
  resource,
  id,
  status,
}: {
  resource: 'leagues' | 'teams' | 'championships' | 'users'
  id: number
  status: iStatus
}) => api.put(`${resource}/${id}/status`, { status })

export default {
  updateStatus,
}
