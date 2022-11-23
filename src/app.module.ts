import { AuthModule } from '@app/auth/auth.module';
import { DatabaseModule } from '@app/base/database/database.module';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
