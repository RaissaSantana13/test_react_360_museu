import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '../../../commons/excpetions/error/entityNotFound.exceptions';
import { UsuarioService } from '../../usuario/service/usuario.service';
import TokenPayload from '../config/tokenPayload.interface';
import { AUTH } from '../constants/login.constants';
import { Credentials } from '../entities/credentials.entity';

export interface RefreshTokenResult {
  cookie: string;
  token: string;
  expiresRefreshToken: Date;
}

export interface AccessTokenResult {
  cookie: string;
  token: string;
  expiresAccessToken: Date;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ): AccessTokenResult {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };

    const secret = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    const expiresInSeconds =
      this.configService.getOrThrow<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ) ?? 3600;

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresInSeconds}s`,
    });

    const expiresAccessToken = new Date(Date.now() + expiresInSeconds * 1000);

    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;

    return {
      cookie,
      token,
      expiresAccessToken,
    };
  }

  public getCookieWithJwtRefreshToken(userId: number): RefreshTokenResult {
    const payload: TokenPayload = { userId };

    const secret = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    const expiresInSeconds = this.configService.getOrThrow<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresInSeconds}s`,
    });

    const expiresRefreshToken = new Date(Date.now() + expiresInSeconds * 1000);

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;

    return {
      cookie,
      token,
      expiresRefreshToken,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<Credentials> {
    try {
      const credentials = await this.getByEmail(email);
      await this.verifyPassword(plainTextPassword, credentials.password);
      return credentials;
    } catch (error: any) {
      console.error(error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return this.usuarioService.buscarPorId(payload.userId);
    }
  }

  async getByEmail(email: string): Promise<Credentials> {
    try {
      const credentials = await this.credentialsRepository
        .createQueryBuilder(AUTH.ENTITY)
        .leftJoinAndSelect('credentials.usuario', 'usuario')
        .where(`${AUTH.SEARCH.POR_EMAIL} = :email`, { email })
        .getOne();
      if (!credentials) {
        throw new EntityNotFoundException(
          AUTH.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return credentials;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        mensagem: 'Erro na pesquisa do e-mail',
        detalhe: error.message, // Isso aparecerá no Postman para você debugar
      });
    }
  }

  async changePassword(
    userId: number,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.credentialsRepository.update(userId, {
      password: hashedPassword,
    });
    return { message: 'Senha alterada com sucesso' };
  }

  async forgotPassword(email: string) {
    const credentials = await this.getByEmail(email);

    if (!credentials) {
      // Por segurança, não confirmamos que o e-mail não existe
      return { message: 'Se o e-mail existir, as instruções foram enviadas.' };
    }

    const payload = { email: credentials.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '900s', // 15 minutos
    });

    const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    // Aqui você chamaria o seu EmailService
    // await this.emailService.sendResetPasswordEmail(email, url);

    return { message: 'E-mail de recuperação enviado.' };
  }

  async resetPassword(password: string, token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        const credentials = await this.getByEmail(payload.email);

        if (!credentials) {
          throw new NotFoundException('Usuário não encontrado.');
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Atualiza a senha e remove o Refresh Token antigo por segurança

        await this.credentialsRepository.update(credentials.idUsuario, {
          password: hashedPassword,
        });

        await this.usuarioService.hashedRefreshToken(credentials.idUsuario);

        return { message: 'Senha redefinida com sucesso!' };
      }
    } catch (error) {
      throw new BadRequestException(
        'Token de recuperação inválido ou expirado.',
      );
    }
  }
}
