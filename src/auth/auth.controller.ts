import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() payload: AuthCreateCredentialsDto): Promise<void> {
    return this.authService.signUp(payload);
  }

  @Post('/signin')
  signIn(
    @Body() payload: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(payload);
  }
}
