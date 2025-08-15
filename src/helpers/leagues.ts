import { omit, pick } from 'lodash/fp'

const parseUsersLeagues = (usersLeagues: any) =>
  usersLeagues.map(({ id, name, email }: { id: number; name: string; email: string }) => ({
    id,
    name,
    email,
  }))

const parseLeagues = (leagues: any) => leagues.map(parseLeague)

const parseLeague = (league: any) => ({
  ...league,
  users: league.users
    .filter(({ owner }: { owner: boolean }) => !owner)
    .map((user: any) => {
      return user.id ? pick(['id', 'name', 'email', 'status'], user) : user
    }),
  ownerId: league.users.find(({ owner }: { owner: boolean }) => owner)?.id ?? null,
  prizes: league.prizes.reduce(
    (acc: any, prize: any) => ({
      ...acc,
      [prize.position]: prize.amount,
    }),
    {},
  ),
})

const parseLeagueInput = (league: any) => ({
  ...omit('ownerId', league),
  users: [...league.users, { id: league.ownerId, owner: 1 }],
  prizes: Object.entries(league.prizes).map(([position, amount]) => ({
    position,
    amount,
  })),
})

export { parseUsersLeagues, parseLeagues, parseLeague, parseLeagueInput }
