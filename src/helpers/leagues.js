import { omit } from 'lodash/fp'

const parseUsersLeagues = (usersLeagues) =>
  usersLeagues.map(({ id, name, email }) => ({
    id,
    name,
    email
  }))

const parseLeagues = (leagues) =>
  leagues.map((league) => ({
    ...league,
    users: league.users
      .filter(({ owner }) => !owner)
      .map(({ id, name, email }) => ({ id, name, email })),
    ownerId: league.users.find(({ owner }) => owner)?.id ?? null
  }))

const parseLeagueInput = (league) => ({
  ...omit('ownerId', league),
  users: [...league.users, { id: league.ownerId, owner: 1 }]
})

export { parseUsersLeagues, parseLeagues, parseLeagueInput }
