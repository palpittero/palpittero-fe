export const STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted'
}

export const STATUSES_LABELS = {
  [STATUSES.ACTIVE]: {
    text: 'common.active',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' }
  },
  [STATUSES.INACTIVE]: {
    text: 'common.inactive',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' }
  }
}

export const BINARY_LABELS = {
  true: {
    text: 'common.yes',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' }
  },
  1: {
    text: 'common.yes',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' }
  },
  false: {
    text: 'common.no',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' }
  },
  0: {
    text: 'common.no',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' }
  },
  null: {
    text: 'common.no',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' }
  }
}

export const STATUSES_OPTIONS = [
  {
    id: STATUSES.ACTIVE,
    name: 'common.active'
  },
  {
    id: STATUSES.INACTIVE,
    name: 'common.inactive'
  }
]
