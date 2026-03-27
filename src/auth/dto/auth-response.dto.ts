import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsArray, IsEmail, ValidateNested, ArrayMinSize } from 'class-validator';

@Exclude()
export class TokenPairDto {
  @Expose()
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;

  @Expose()
  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  @IsNumber()
  expiresIn: number;

  @Expose()
  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  @IsString()
  tokenType: string;

  constructor(partial: Partial<TokenPairDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class AuthUserDto {
  @Expose()
  @ApiProperty({ example: 'user_abc123' })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @Expose()
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @ApiPropertyOptional({ example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @Expose()
  @ApiProperty({ example: ['user'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  roles: string[];

  constructor(partial: Partial<AuthUserDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({ type: AuthUserDto })
  @ValidateNested()
  @Type(() => AuthUserDto)
  user: AuthUserDto;

  @Expose()
  @ApiProperty({ type: TokenPairDto })
  @ValidateNested()
  @Type(() => TokenPairDto)
  tokens: TokenPairDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @ApiProperty({ type: AuthUserDto })
  @ValidateNested()
  @Type(() => AuthUserDto)
  user: AuthUserDto;

  @Expose()
  @ApiProperty({
    description: 'Message about email verification',
    example: 'Please check your email to verify your account',
  })
  @IsString()
  message: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class MessageResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  @IsString()
  message: string;

  constructor(partial: Partial<MessageResponseDto>) {
    Object.assign(this, partial);
  }
}
