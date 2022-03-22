import { Vote } from '../vote/vote.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Joke } from '../joke/joke.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @OneToMany(() => Joke, (Joke) => Joke.user)
  jokes: Joke[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
