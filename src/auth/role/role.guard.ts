import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { AllowedRoles } from 'src/auth/role/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class RoleGuard extends AuthGuard('roles') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      // @Role() 이 붙지 않은 resolver는 role이 undefined이다 => 아무나 접근 가능
      return true;
    }

    const ctx = context.switchToHttp().getRequest();
    const token = ctx.headers.authorization;

    if (token) {
      const decoded = this.jwtService.verify(token);

      if (
        typeof decoded === 'object' &&
        decoded.hasOwnProperty('platform') &&
        decoded.hasOwnProperty('platformId')
      ) {
        const { ok, user } = await this.usersService.findByPlatform({
          platform: decoded['platform'],
          platformId: decoded['platformId'],
        });
        if (!ok) return false;
        ctx['user'] = user;
        if (roles.includes('Any')) return true;
        return roles.includes(user.role);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
