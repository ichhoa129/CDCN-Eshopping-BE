import { AuthenticateGuard } from '@app/auth/guard/roles.decorator';
import { ValidHttpResponse } from '@core/response/validHttp.response';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(public userService: UserService) {}

  @Get('me')
  @AuthenticateGuard()
  @ApiOperation({
    tags: ['Users'],
    operationId: 'Get me',
    summary: 'Get me',
    description: 'Get me',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get me',
  })
  async getOne(@Request() req: any) {
    const data = await this.userService.getMe(req.user.email);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Put('update-password')
  @AuthenticateGuard()
  @ApiOperation({
    tags: ['Users'],
    operationId: 'Update password',
    summary: 'Update password',
    description: 'Update password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update password',
  })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req: any,
  ) {
    const data = await this.userService.updatePassword(
      req.user.email,
      updatePasswordDto.password,
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Put('update-profile')
  @AuthenticateGuard()
  @ApiOperation({
    tags: ['Users'],
    operationId: 'Update profile',
    summary: 'Update profile',
    description: 'Update profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update profile',
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any,
  ) {
    const data = await this.userService.updateProfile(
      updateProfileDto,
      req.user.email,
    );
    return ValidHttpResponse.toOkResponse(data);
  }
}
