import { EntityRepository, Repository } from 'typeorm';
import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.query(
      `
          SELECT * FROM users WHERE email = '${email}'
      `,
    );
    return user[0];
  }

  async createUser(input: AuthCreateCredentialsDto): Promise<void> {
    const { email, password, name } = input;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.query(
      `
        INSERT INTO users(email, password, name ) 
        VALUES ('${email}', '${hashedPassword}', '${name}') RETURNING *
    `,
    );
  }
}
