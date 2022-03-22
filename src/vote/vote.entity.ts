import { User } from '../auth/user.entity';
import { Joke } from '../joke/joke.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteTypes } from './vote-type.enum';

@Entity({ name: 'votes' })
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Joke, (joke) => joke.votes)
  @JoinColumn({ name: 'joke_id' })
  joke: Joke;

  @Column({
    type: 'enum',
    enum: VoteTypes,
  })
  type: VoteTypes;
}
