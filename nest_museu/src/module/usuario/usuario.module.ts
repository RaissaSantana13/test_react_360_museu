import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './controller/usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './service/usuario.service';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../access/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role])],
  exports: [UsuarioService],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
