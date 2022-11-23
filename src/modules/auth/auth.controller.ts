import { ValidHttpResponse } from '@core/response/validHttp.response';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    tags: ['Auth'],
    operationId: 'Sign up',
    summary: 'Sign up',
    description: 'Sign up',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up',
  })
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    await this.authService.signUp(authCredentialsDto);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Post('signin')
  @ApiOperation({
    tags: ['Auth'],
    operationId: 'Sign in',
    summary: 'Sign in',
    description: 'Sign in',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign in',
  })
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    const data = await this.authService.signIn(authCredentialsDto);
    return ValidHttpResponse.toOkResponse(data);
  }
}
