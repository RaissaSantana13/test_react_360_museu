import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permissions.entitty';
import { Resource } from './entities/resources.entity';
import { Role } from './entities/role.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, Resource, Permissions])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AcessoModule {}
