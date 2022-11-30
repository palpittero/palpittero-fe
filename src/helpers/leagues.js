import { omit, pick } from 'lodash/fp'

const parseUsersLeagues = (usersLeagues) =>
  usersLeagues.map(({ id, name, email }) => ({
    id,
    name,
    email
  }))

const parseLeagues = (leagues) => leagues.map(parseLeague)

const parseLeague = (league) => ({
  ...league,
  users: league.users
    .filter(({ owner }) => !owner)
    .map((user) => {
      return user.id ? pick(['id', 'name', 'email', 'status'], user) : user
    }),
  ownerId: league.users.find(({ owner }) => owner)?.id ?? null,
  prizes: league.prizes.reduce(
    (acc, prize) => ({
      ...acc,
      [prize.position]: prize.amount
    }),
    {}
  )
})

const parseLeagueInput = (league) => ({
  ...omit('ownerId', league),
  users: [...league.users, { id: league.ownerId, owner: 1 }],
  prizes: Object.entries(league.prizes).map(([position, amount]) => ({
    position,
    amount
  }))
})

export { parseUsersLeagues, parseLeagues, parseLeague, parseLeagueInput }
