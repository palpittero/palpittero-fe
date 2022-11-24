const getChampionshipPositionsInitialValues = (championshipId) => ({
  1: {
    championshipId,
    team: null,
    teamId: null,
    position: 1
  },
  2: {
    championshipId,
    team: null,
    teamId: null,
    position: 2
  }
})

const parseChampionshipPositions = (positions) =>
  positions.reduce(
    (acc, championshipPosition) => ({
      ...acc,
      [championshipPosition.position]: championshipPosition
    }),
    {}
  )

const parseChampionshipInput = (championship) => ({
  ...championship,
  positions: Object.values(championship?.positions || {})
})

export {
  getChampionshipPositionsInitialValues,
  parseChampionshipPositions,
  parseChampionshipInput
}
