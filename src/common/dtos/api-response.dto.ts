import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';

/**
 * Error details structure
 */
@Exclude()
export class ErrorDetailsDto {
  @Expose()
  @ApiProperty({ description: 'Error code', example: 'VALIDATION_ERROR' })
  @IsString()
  code: string;

  @Expose()
  @ApiProperty({ description: 'Additional error details', example: ['Field is required'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];

  constructor(partial: Partial<ErrorDetailsDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Standardized API Response Structure
 * Unified format for all success and error responses
 */
@Exclude()
export class ApiResponseDto<T> {
  @Expose()
  @ApiProperty({ description: 'Indicates if the operation was successful' })
  @IsBoolean()
  success: boolean;

  @Expose()
  @ApiProperty({ description: 'HTTP status code' })
  @IsNumber()
  statusCode: number;

  @Expose()
  @ApiProperty({ description: 'Response message' })
  @IsString()
  message: string;

  @Expose()
  @ApiProperty({ description: 'Response data payload', required: false })
  @IsOptional()
  data: T | null;

  @Expose()
  @ApiProperty({
    description: 'Error details if success is false',
    required: false,
    type: ErrorDetailsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ErrorDetailsDto)
  error?: ErrorDetailsDto;

  @Expose()
  @ApiProperty({ description: 'UTC timestamp of the response' })
  @IsString()
  @Transform(({ value }) => value || new Date().toISOString())
  timestamp: string;

  @Expose()
  @ApiProperty({ description: 'API request path' })
  @IsString()
  path: string;

  @Expose()
  @ApiProperty({ description: 'Unique request/correlation identifier' })
  @IsString()
  requestId: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = this.timestamp || new Date().toISOString();
  }

  /**
   * Static helper to create a success response
   */
  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
    path?: string,
    requestId?: string,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      statusCode,
      message,
      data,
      path,
      requestId,
    });
  }

  /**
   * Static helper to create an error response
   */
  static error(
    message: string,
    errorCode: string,
    statusCode = 400,
    details?: string[],
    path?: string,
    requestId?: string,
  ): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      statusCode,
      message,
      data: null,
      error: new ErrorDetailsDto({
        code: errorCode,
        details,
      }),
      path,
      requestId,
    });
  }
}
