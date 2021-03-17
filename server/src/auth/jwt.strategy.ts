import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _configService: ConfigService,
  ) 
  {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //req will have the token inside the authorization header with the form of 'Bearer <token>'
      secretOrKey: _configService.get('JWT_SECRET') || 'secret123',
    });
  }

  async validate(payload: JwtPayload): Promise<boolean> {
    const { email } = payload;
    if (email) {
      return true;
    }
    return false;
  }
}
