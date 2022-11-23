import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from 'src/config/env';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: {
        expiresIn: JWT.EXPIRES_IN,
      },
    }),
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
