export default {
  name: 'Nome',
  homeTeam: 'Time da Casa',
  championship: 'Campeonato',
  round: 'Rodada',
  awayTeam: 'Time Visitante',
  date: 'Data/Horário',
  roundChampionship: 'Rodada / Campeonato',
  score: 'Placar',
  matchDetails: 'Detalhes da Partida',
  deleteConfirmation:
    'Tem certeza de que deseja remover a partida <b>{name}</b>? | <p>Tem certeza de que deseja remover as partidas abaixo?</p> <p><b>{name}</b></p>',
  deleteSuccess: 'Partida removida com sucesso',
  saveSuccess: 'Partida salva com sucesso',
  validation: {
    homeTeam: 'Favor informar o time da casa',
    awayTeam: 'Favor informar o time visitante',
    date: 'Favor informar a data',
    regularTimeHomeTeamGoals: 'Favor informar o total de gols do time da casa',
    regularTimeAwayTeamGoals:
      'Favor informar o total de gols do time visitante',
    round: 'Favor informar a rodada'
  },
  status: {
    scheduled: 'Agendada',
    preparation: 'Pré-jogo',
    cancelled: 'Cancelada',
    finished: 'Concluída'
  },
  setResult: 'Registrar Resultado / {name} - {championship}'
}
