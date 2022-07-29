const parseUsersLeagues = (usersLeagues) =>
  usersLeagues.map(({ id, name }) => ({
    id,
    name
  }))

export { parseUsersLeagues }
