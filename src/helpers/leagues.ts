import type { iLeague } from '@/types'
import { pick } from 'lodash/fp'

const parseUsersLeagues = (usersLeagues: any) =>
  usersLeagues.map(({ id, name, email }: { id: number; name: string; email: string }) => ({
    id,
    name,
    email,
  }))

const parseLeagues = (leagues: any) => leagues.map(parseLeague)

const parseLeague = (league: any) => {
  const owner = league.users.find(({ owner }: { owner: boolean }) => owner) ?? null

  return {
    ...league,
    users: league.users
      .filter(({ owner }: { owner: boolean }) => !owner)
      .map((user: any) => (user.id ? pick(['id', 'name', 'email', 'status'], user) : user)),
    owner,
    ownerId: owner?.id ?? null,
    prizes: league.prizes.length
      ? league.prizes.reduce(
          (acc: any, prize: any) => ({
            ...acc,
            [prize.position]: prize.amount,
          }),
          {},
        )
      : [
          {
            position: 1,
            amount: 0,
          },
          {
            position: 2,
            amount: 0,
          },
          {
            position: 3,
            amount: 0,
          },
        ],
  }
}

const parseLeagueInput = (league: iLeague) => ({
  ...league,
  users: [...league.users, { id: league.ownerId, owner: 1 }],
})

export { parseUsersLeagues, parseLeagues, parseLeague, parseLeagueInput }
