import { User } from '../auth/user.entity';
import { Vote } from '../vote/vote.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'jokes' })
export class Joke {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  description!: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  upvotes!: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  downvotes!: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.jokes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Vote, (vote) => vote.joke)
  votes: Vote[];
}
