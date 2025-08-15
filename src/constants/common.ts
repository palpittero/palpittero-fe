import type { iStatus } from '@/types'

export const STATUSES: Record<string, iStatus> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
}

export const STATUSES_LABELS: Record<
  iStatus,
  { text: string; icon: string; iconStyle: { color: string } }
> = {
  active: {
    text: 'Ativo',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' },
  },
  inactive: {
    text: 'Inativo',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
  },
  deleted: {
    text: 'Removido',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
  },
}

export const BINARY_LABELS: Record<
  string,
  { text: string; icon: string; iconStyle: { color: string } }
> = {
  true: {
    text: 'Sim',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' },
  },
  1: {
    text: 'Sim',
    icon: 'pi pi-check',
    iconStyle: { color: 'var(--green-600)' },
  },
  false: {
    text: 'Não',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
  },
  0: {
    text: 'Não',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
  },
  null: {
    text: 'Não',
    icon: 'pi pi-times',
    iconStyle: { color: 'var(--red-600)' },
  },
}

export const STATUSES_OPTIONS: { id: iStatus; name: string }[] = [
  {
    id: 'active',
    name: 'Ativo',
  },
  {
    id: 'inactive',
    name: 'Inativo',
  },
]

export const HTTP_MULTIPART_CONFIG: { header: { 'Content-Type': string } } = {
  header: {
    'Content-Type': 'multipart/form-data',
  },
}

export const BADGE_AVATAR_PLACEHOLDER: string = '/images/image-placeholder.png'
export const USER_AVATAR_PLACEHOLDER: string = '/images/avatar-placeholder.jpeg'
