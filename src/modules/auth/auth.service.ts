import { UserService } from '@app/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createOne(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const result = await this.userService.isValidCredential(authCredentialsDto);

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { email } = authCredentialsDto;
    const payload: JwtPayload = { email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async verifyEmailToken(token: any) {
    const tokenPayload = this.jwtService.verify(token);
    const { email } = tokenPayload;

    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.isEmailConfirmed = true;
    await this.userService.saveUser(user);
    const accessToken = this.jwtService.sign({ email });

    return { accessToken };
  }
}
