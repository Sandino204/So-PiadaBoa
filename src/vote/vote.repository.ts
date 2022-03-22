import { Repository, EntityRepository } from 'typeorm';
import { GetVoteDto } from './dto/get-vote.dto';
import { PutVoteDto } from './dto/put-interaction.dto';
import { Vote } from './vote.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
  async getVote(input: GetVoteDto): Promise<Vote> {
    const { userId, jokeId } = input;
    const found: Vote[] = await this.query(
      `
        SELECT * 
        FROM votes
        WHERE 
          joke_id = '${jokeId}' AND
          user_id = '${userId}'
      `,
    );

    return found[0];
  }

  async putVote(input: PutVoteDto): Promise<void> {
    const { jokeId, userId, type } = input;

    const found: Vote[] = await this.query(
      `
      SELECT * 
      FROM votes
      WHERE 
        joke_id = '${jokeId}' AND
        user_id = '${userId}'
    `,
    );

    if (found[0]) {
      await this.query(
        `
         UPDATE votes
         SET type = '${type}'
         WHERE 
            joke_id = '${jokeId}' AND
            user_id = '${userId}'
       `,
      );

      return;
    }

    await this.query(
      `
      INSERT INTO votes(joke_id, type, user_id) 
      VALUES ('${jokeId}', '${type}', '${userId}')
    `,
    );
  }

  async deleteVoteByJokeId(jokeId: string): Promise<void> {
    await this.query(
      `
      DELETE FROM votes WHERE joke_id = '${jokeId}'
    `,
    );
  }
}
