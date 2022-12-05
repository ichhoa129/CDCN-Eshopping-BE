import { AuthModule } from '@app/auth/auth.module';
import { DatabaseModule } from '@app/base/database/database.module';
import { CategoryModule } from '@app/category/category.module';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
