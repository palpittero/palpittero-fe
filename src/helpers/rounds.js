import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const isPenaltiesRoundType = (match) =>
  [
    CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
  ].includes(match.round.type)

export { isPenaltiesRoundType }
