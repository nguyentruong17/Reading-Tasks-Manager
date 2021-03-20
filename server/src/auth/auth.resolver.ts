import {
  Injectable,
} from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { User } from '../user/user.model';

//services
import { AuthService } from './auth.service';




@Injectable()
@Resolver()
export class AuthResolver {

  constructor(private readonly _authService: AuthService) {}
  
  @Mutation((returns) => String)
  public async login(
    @Args('idToken') accessToken: string,
    @Context() { req, res },
  ): Promise<string> {
    return this._authService.authenticate(accessToken, req, res)
  }
}
