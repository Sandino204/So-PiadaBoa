import { Repository, EntityRepository } from 'typeorm';
import { CreateJokeDto } from './dto/create-joke.dto';
import { Joke } from './joke.entity';
import { GetJokeFilterDto } from './dto/get-joke-filter.dto';
import { GetJokeByUserFilterDto } from './dto/get-joke-filter-user.dto';
import { GetJokeDto } from './dto/get-joke.dto';
import { VoteTypes } from '../vote/vote-type.enum';

@EntityRepository(Joke)
export class JokeRepository extends Repository<Joke> {
  async getJokes(input: GetJokeFilterDto): Promise<Joke[]> {
    const { search, sort } = input;

    if (search) {
      const jokes: Joke[] = await this.query(
        `
        SELECT jokes.id, title,  description,  upvotes as likes, downvotes as dislikes, created_at, u.name as user
        FROM jokes
        INNER JOIN users as u ON u.id = jokes.user_id
        WHERE
            (LOWER(jokes.title) LIKE LOWER('%${search}%') OR LOWER(jokes.description) LIKE LOWER('%${search}%'))
        ORDER BY created_at ${sort === 'asc' ? 'asc' : 'desc'}
        `,
      );

      return jokes;
    }

    const jokes: Joke[] = await this.query(
      `
            SELECT jokes.id, title, description, upvotes as likes, downvotes as dislikes, created_at , u.name as user
            FROM jokes
            INNER JOIN users as u ON u.id = jokes.user_id 
            ORDER BY created_at ${sort === 'asc' ? 'asc' : 'desc'}
        `,
    );

    return jokes;
  }

  async getJokesByUser(input: GetJokeByUserFilterDto): Promise<Joke[]> {
    const { search, userId, sort } = input;

    if (search) {
      const jokes: Joke[] = await this.query(
        `
        SELECT jokes.id, title, description, upvotes as likes, downvotes as dislikes, created_at, u.name as user
        FROM jokes
        INNER JOIN users as u ON u.id = jokes.user_id
        WHERE
            u.id = '${userId}' AND
            (LOWER(jokes.title) LIKE LOWER('%${search}%') OR LOWER(jokes.description) LIKE LOWER('%${search}%'))
            ORDER BY created_at ${sort === 'asc' ? 'asc' : 'desc'}
      `,
      );

      return jokes;
    }

    const jokes: Joke[] = await this.query(
      `
            SELECT jokes.id, title, description,  upvotes as likes,  downvotes as dislikes, created_at, u.name as user
            FROM jokes
            INNER JOIN users as u ON u.id = jokes.user_id
            WHERE
                u.id = '${userId}'
            ORDER BY created_at ${sort === 'asc' ? 'asc' : 'desc'}
        `,
    );

    return jokes;
  }

  async getJokeById(input: GetJokeDto): Promise<Joke | null> {
    const { userId, jokeId } = input;

    if (userId !== undefined) {
      const joke: Joke[] = await this.query(
        `
          SELECT jokes.id, jokes.title as title, jokes.description as description, upvotes as likes, downvotes as dislikes, created_at, u.name as user 
          FROM jokes
          INNER JOIN users as u ON u.id = jokes.user_id
          WHERE 
              jokes.id = '${jokeId}' AND 
              user_id = '${userId}'
        `,
      );

      return joke[0] ? joke[0] : null;
    }

    const joke: Joke[] = await this.query(
      `
        SELECT jokes.id, jokes.title as title, jokes.description as description, upvotes as likes, downvotes as dislikes, created_at, u.name as user 
        FROM jokes
        INNER JOIN users as u ON u.id = jokes.user_id
        WHERE 
            jokes.id = '${jokeId}'
      `,
    );

    return joke[0];
  }

  async createJoke(input: CreateJokeDto): Promise<Joke> {
    const { description, userId, title } = input;
    const newJoke: Joke[] = await this.query(
      `
        INSERT INTO jokes(title, description, user_id) 
        VALUES ('${title}', '${description}', '${userId}') RETURNING *
    `,
    );

    return newJoke[0];
  }

  async updateJoke(input: {
    description: string;
    title: string;
    jokeId: string;
    userId: string;
  }): Promise<Joke> {
    const { description, title, jokeId, userId } = input;
    const updatedJoke: Joke[] = await this.query(
      `
      UPDATE jokes
      SET 
        title = '${title}', 
        description = '${description}' 
      WHERE 
        jokes.id = '${jokeId}' AND 
        user_id = '${userId}'
      RETURNING *
      `,
    );

    return updatedJoke[0];
  }

  async updateVote(input: {
    vote: VoteTypes;
    jokeId: string;
    value: number;
  }): Promise<Joke> {
    const { jokeId, vote, value } = input;
    const updatedJoke: Joke[] = await this.query(
      `
            UPDATE jokes SET ${vote} = ${vote} + ${value} 
            WHERE id = '${jokeId}'
            RETURNING *
        `,
    );

    return updatedJoke[0];
  }

  async deleteJoke(jokeId: string): Promise<void> {
    await this.query(
      `
      DELETE FROM jokes WHERE id = '${jokeId}'
    `,
    );
  }
}
