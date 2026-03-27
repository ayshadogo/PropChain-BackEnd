import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsArray, IsDate, IsNumber, MaxLength, IsEmail } from 'class-validator';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'User unique identifier',
    example: 'user_abc123',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Blockchain enthusiast and property investor.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'User location',
    example: 'London, UK',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'User preferences (JSON object)',
    example: '{ "theme": "dark", "notifications": true }',
    type: Object,
  })
  @IsOptional()
  @Transform(({ value }) => value ?? {})
  preferences?: Record<string, any>;

  @Expose()
  @ApiPropertyOptional({
    description: 'User privacy settings (JSON object)',
    example: '{ "profileVisible": true }',
    type: Object,
  })
  @IsOptional()
  @Transform(({ value }) => value ?? {})
  privacySettings?: Record<string, any>;

  @Expose()
  @ApiPropertyOptional({
    description: 'Followers count',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'number' ? value : 0))
  followersCount?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Following count',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'number' ? value : 0))
  followingCount?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'User activity count',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'number' ? value : 0))
  activityCount?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'User login count',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'number' ? value : 0))
  loginCount?: number;

  @Expose()
  @ApiProperty({
    description: 'Whether the user email is verified',
    example: true,
  })
  @IsBoolean()
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'User roles',
    example: ['user'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @Expose()
  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-15T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-22T09:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class UserListItemDto {
  @Expose()
  @ApiProperty({
    description: 'User unique identifier',
    example: 'user_abc123',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Expose()
  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'User roles',
    example: ['user'],
    type: [String],
  })
  @IsArray()
  roles: string[];

  @Expose()
  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-15T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  constructor(partial: Partial<UserListItemDto>) {
    Object.assign(this, partial);
  }
}
