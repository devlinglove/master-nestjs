import { Expose } from 'class-transformer';
import { User } from './user.entity';

export class LoginResponse extends User {
  @Expose()
  token: string;
}
