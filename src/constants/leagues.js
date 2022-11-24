import { STATUSES } from '.'

export const LEAGUE_POINTS_STRATEGY = {
  GROUPED: 'grouped',
  ACCUMULATIVE: 'accumulative'
}

export const LEAGUE_MODEL = {
  name: '',
  badge: '',
  private: 0,
  users: [],
  championships: [],
  ownerId: null,
  pointsStrategy: LEAGUE_POINTS_STRATEGY.GROUPED,
  status: STATUSES.ACTIVE,
  resendInvitations: false,
  enableGuesses: false
}

export const USERS_LEAGUES_STATUSES = {
  INVITED: 'invited',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const LEAGUES_INVITATIONS_STATUSES = {
  PENDING: 'pending',
  SENT: 'sent'
}

export const USERS_LEAGUES_INVITATIONS_OPTIONS = [
  {
    id: false,
    name: 'app.leagues.pendingInvitations.reject',
    icon: 'pi pi-times mr-2'
  },
  {
    id: true,
    name: 'app.leagues.pendingInvitations.approve',
    icon: 'pi pi-check mr-2'
  }
]

export const USERS_LEAGUES_STATUSES_LABELS = {
  [USERS_LEAGUES_STATUSES.INVITED]: {
    text: 'admin.leagues.status.invited',
    icon: 'pi pi-clock',
    iconStyle: { color: 'var(--blue-600)' }
  },
  [USERS_LEAGUES_STATUSES.APPROVED]: {
    text: 'admin.leagues.status.approved',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' }
  }
}

export const LEAGUES_INVITATIONS_STATUSES_LABELS = {
  [LEAGUES_INVITATIONS_STATUSES.PENDING]: {
    text: 'admin.leagues.status.pending',
    icon: 'pi pi-clock',
    iconStyle: { color: 'var(--blue-600)' }
  },
  [LEAGUES_INVITATIONS_STATUSES.SENT]: {
    text: 'admin.leagues.status.sent',
    icon: 'pi pi-user-edit',
    iconStyle: { color: 'var(--orange-600)' }
  }
}
