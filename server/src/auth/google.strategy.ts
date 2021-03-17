import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-token-google2';

//https://github.com/DavyBello/graphql-social-auth-tutorial
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-token') {
  constructor(
    private _configService: ConfigService,
  ) {
    super({
      clientID: _configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: _configService.get('GOOGLE_CLIENT_SECRET'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ): Promise<any> {
    //console.log(profile)
    const { id, emails, name: {familyName, givenName} } = profile;
    const user = {
      id,
      email: emails[0].value,
      firstName: familyName ? familyName : '',
      lastName: givenName ? givenName : '',
      accessToken,
    };
    return done(null, user);
  }
}
