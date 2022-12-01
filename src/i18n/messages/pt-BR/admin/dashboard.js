export default {
  users: 'Usuários',
  leagues: 'Ligas',
  processedGuesses: 'Palpites Processados',
  unprocessedGuesses: {
    title:
      'Existe {total} palpite não processado | Existem {total} palpites não processados',
    cta: 'Ver Detalhes',
    league: {
      header: '{leagueName} - Processar palpites',
      message:
        'Deseja realmente processar os palpites da liga <b>{leagueName}</b>?'
    },
    championship: {
      header: '{leagueName} / {championshipName} - Processar palpites',
      message:
        'Deseja realmente processar os palpites do campeonato <b>{championshipName}</b> na liga <b>{leagueName}</b>?'
    },
    all: {
      header: 'Processar todos os palpites',
      message: 'Deseja realmente processar todos os palpites de todas as ligas?'
    }
  },
  guessesProcessedSuccess: 'Palpites processados com sucesso',
  processGuesses: {
    header: 'Processar palpites',
    message: 'Deseja realmente processar os palpites?'
  }
}
