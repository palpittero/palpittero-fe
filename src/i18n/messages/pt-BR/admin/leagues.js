export default {
  name: 'Nome',
  badge: 'Escudo/Bandeira',
  participants: 'Participantes',
  championships: 'Campeonatos',
  leagueDetails: 'Detalhes da Liga',
  deleteConfirmation:
    '<p>Ao remover esta liga, toda a pontuação conquistada por todos os participantes será perdida.</p> Tem certeza de que deseja remover a liga <b>{name}</b>?|<p>Ao remover estas ligas, toda a pontuação conquistada por todos os participantes será perdida.</p>  <p>Tem certeza de que deseja remover as ligas abaixo?</p> <p><b>{name}</b></p>',
  deleteSuccess: 'Liga removida com sucesso',
  saveSuccess: 'Liga salva com sucesso',
  validation: {
    name: 'Favor informar um nome',
    championships: 'Selecione pelo menos um campeonato'
  },
  pointsStrategy: 'Regras de Pontuação',
  grouped: 'Agrupado',
  accumulative: 'Acumulativo',
  public: 'Pública',
  private: 'Privada',
  status: {
    invited: 'Convite enviado',
    approved: 'Aprovado',
    sent: 'Aguardando cadastro',
    pending: 'Pendente'
  },
  error: {
    delete: 'Erro ao tentar remover liga',
    update: 'Erro ao tentar atualizar liga'
  },
  inviteUsers: 'Convidar Usuários',
  inviteUsersConfirmation:
    'Deseja realmente convidar os usuários abaixo para a liga <b>{leagueName}</b>:',
  approveUsersConfirmation:
    'Deseja realmente aprovar manualmente a participação do usuário abaixo na liga <b>{leagueName}</b>:',
  inviteUsersSuccess: 'Convites enviados com sucesso',
  deleteUserConfirmation:
    'Deseja realmente remover o usuário <b>{userName}</b> da liga <b>{leagueName}</b>?',
  deleteUserSuccess: 'Usuário removido da liga com sucesso',
  leagueOwner: 'Proprietário da liga',
  owner: 'Proprietário',
  newLeague: 'Nova Liga',
  usersWithoutAccount:
    'Usuários que não possuem conta na plataforma serão convidados a se registrarem para, então, receberem o convite para a liga',
  resendInvitations: 'Reenviar Convites',
  enablePrizes: 'Habilitar Prêmios',
  ticketValue: 'Valor do ingresso',
  prizes: 'Prêmio | Prêmios',
  positions: {
    first: 'Primeiro colocado',
    second: 'Segundo colocado',
    third: 'Terceiro Colocado'
  }
}
