const getChampionshipPositionsInitialValues = (championshipId: number) => ({
  1: {
    championshipId,
    team: null,
    teamId: null,
    position: 1,
  },
  2: {
    championshipId,
    team: null,
    teamId: null,
    position: 2,
  },
})

const parseChampionshipPositions = (positions: any) =>
  positions.reduce(
    (acc: any, championshipPosition: any) => ({
      ...acc,
      [championshipPosition.position]: championshipPosition,
    }),
    {},
  )

const parseChampionshipInput = (championship: any) => ({
  ...championship,
  positions: Object.values(championship?.positions || {}),
})

export { getChampionshipPositionsInitialValues, parseChampionshipPositions, parseChampionshipInput }
