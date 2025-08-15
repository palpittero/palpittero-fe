export const MATCH_STATUSES = {
  SCHEDULED: 'scheduled',
  PREPARATION: 'preparation',
  IN_PROGRESS: 'in_progress',
  REGULAR_TIME: 'regularTime',
  EXTRA_TIME: 'extraTime',
  PENALTIES: 'penalties',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
  DELETED: 'deleted'
}

export const MATCH_STATUSES_LABELS = {
  [MATCH_STATUSES.SCHEDULED]: {
    text: 'admin.matches.status.scheduled',
    icon: 'pi pi-calendar',
    iconStyle: { color: 'var(--blue-600)' },
    severity: 'info'
  },
  [MATCH_STATUSES.PREPARATION]: {
    text: 'admin.matches.status.preparation',
    icon: 'pi pi-clock',
    iconStyle: { color: 'var(--warning-600)' },
    severity: 'warning'
  },
  [MATCH_STATUSES.IN_PROGRESS]: {
    text: 'admin.matches.status.inProgress',
    icon: 'pi pi-play',
    iconStyle: { color: 'var(--warning-600)' },
    severity: 'primary'
  },
  [MATCH_STATUSES.FINISHED]: {
    text: 'admin.matches.status.finished',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' },
    severity: 'success'
  },
  [MATCH_STATUSES.CANCELLED]: {
    text: 'admin.matches.status.cancelled',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
    severity: 'danger'
  }
}

export const MATCH_STATUSES_OPTIONS = [
  {
    id: MATCH_STATUSES.SCHEDULED,
    name: 'matches.status.scheduled'
  },
  {
    id: MATCH_STATUSES.PREPARATION,
    name: 'matches.status.preparation'
  },
  {
    id: MATCH_STATUSES.FINISHED,
    name: 'matches.status.finished'
  },
  {
    id: MATCH_STATUSES.IN_PROGRESS,
    name: 'matches.status.in_progress'
  }
]

export const MATCH_DETAIL_MODEL = {
  homeTeamId: null,
  awayTeamId: null,
  date: ''
}

export const MATCH_MODEL = {
  result: '',
  roundId: null,
  championship: null,
  round: null,
  homeTeam: null,
  awayTeam: null,
  status: null,
  details: [],
  resetStatus: true
}

export const MATCH_RESULTS = {
  DRAW: 'draw',
  HOME_TEAM_REGULAR_TIME_WIN: 'homeTeamRegularTimeWin',
  AWAY_TEAM_REGULAR_TIME_WIN: 'awayTeamRegularTimeWin',
  HOME_TEAM_EXTRA_TIME_WIN: 'homeTeamExtraTimeWin',
  AWAY_TEAM_EXTRA_TIME_WIN: 'awayTeamExtraTimeWin',
  HOME_TEAM_PENALTIES_WIN: 'homeTeamPenaltiesWin',
  AWAY_TEAM_PENALTIES_WIN: 'awayTeamPenaltiesWin'
}
