import { STATUSES } from '.'

export const LEAGUE_POINTS_STRATEGY = {
  GROUPED: 'grouped',
  ACCUMULATIVE: 'accumulative'
}

export const LEAGUE_MODEL = {
  name: '',
  badge: '',
  private: false,
  users: [],
  championships: [],
  ownerId: null,
  pointsStrategy: LEAGUE_POINTS_STRATEGY.GROUPED,
  status: STATUSES.ACTIVE
}

export const USERS_LEAGUES_STATUSES = {
  INVITED: 'invited',
  APPROVED: 'approved'
}

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
