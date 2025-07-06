import { Expose } from 'class-transformer';
//import { User } from 'src/users/user.entity';

export class UserProfileDto {
  constructor(private readonly partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: string;

  @Expose()
  name: string;
}
