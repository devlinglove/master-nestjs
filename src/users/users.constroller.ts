import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
//import { UserService } from './user/user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(private userService: UserService) {}
}
