import { Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class LoginResponse extends User {
  @Expose()
  token: string;
}
