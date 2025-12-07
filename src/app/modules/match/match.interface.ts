interface RespondMatchInput {
  matchId: string;
  ownerId: string;
  status: 'ACCEPTED' | 'REJECTED';
}