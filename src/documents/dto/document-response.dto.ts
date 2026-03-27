import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum, IsDate, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { DocumentType, DocumentAccessLevel, DocumentStatus } from '../document.model';

@Exclude()
export class DocumentVersionDto {
  @Expose()
  @ApiProperty({
    description: 'Version number',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  version: number;

  @Expose()
  @ApiProperty({
    description: 'Storage key for the file',
    example: 'documents/abc123/v1.pdf',
  })
  @IsString()
  storageKey: string;

  @Expose()
  @ApiProperty({
    description: 'File checksum',
    example: 'sha256:abc123...',
  })
  @IsString()
  checksum: string;

  @Expose()
  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsNumber()
  @Min(0)
  size: number;

  @Expose()
  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  mimeType: string;

  @Expose()
  @ApiProperty({
    description: 'Upload timestamp',
    example: '2024-01-15T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'User who uploaded this version',
    example: 'user_abc123',
  })
  @IsString()
  uploadedBy: string;

  @Expose()
  @ApiProperty({
    description: 'Original file name',
    example: 'deed.pdf',
  })
  @IsString()
  originalFileName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Thumbnail storage key',
    example: 'thumbnails/abc123/v1.png',
  })
  @IsOptional()
  @IsString()
  thumbnailKey?: string;

  constructor(partial: Partial<DocumentVersionDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class DocumentMetadataResponseDto {
  @Expose()
  @ApiPropertyOptional({
    description: 'Associated property ID',
    example: 'prop_abc123',
  })
  @IsOptional()
  @IsString()
  propertyId?: string;

  @Expose()
  @ApiProperty({
    description: 'Document title',
    example: 'Property Deed 2024',
  })
  @IsString()
  title: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Document description',
    example: 'Official property deed document',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'Document tags',
    example: ['legal', 'deed', '2024'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  tags: string[];

  @Expose()
  @ApiProperty({
    description: 'User who uploaded the document',
    example: 'user_abc123',
  })
  @IsString()
  uploadedBy: string;

  @Expose()
  @ApiProperty({
    description: 'Document access level',
    enum: DocumentAccessLevel,
    example: DocumentAccessLevel.PRIVATE,
  })
  @IsEnum(DocumentAccessLevel)
  accessLevel: DocumentAccessLevel;

  @Expose()
  @ApiProperty({
    description: 'User IDs allowed to access',
    example: ['user1', 'user2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  allowedUserIds: string[];

  @Expose()
  @ApiProperty({
    description: 'Roles allowed to access',
    example: ['ADMIN', 'AGENT'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  allowedRoles: string[];

  @Expose()
  @ApiProperty({
    description: 'Custom metadata fields',
    example: { category: 'legal' },
  })
  @Transform(({ value }) => value ?? {})
  customFields: Record<string, string>;

  constructor(partial: Partial<DocumentMetadataResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class DocumentResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Document unique identifier',
    example: 'doc_abc123',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Document type',
    enum: DocumentType,
    example: DocumentType.DEED,
  })
  @IsEnum(DocumentType)
  type: DocumentType;

  @Expose()
  @ApiProperty({
    description: 'Document metadata',
    type: DocumentMetadataResponseDto,
  })
  @ValidateNested()
  @Type(() => DocumentMetadataResponseDto)
  metadata: DocumentMetadataResponseDto;

  @Expose()
  @ApiProperty({
    description: 'Document versions',
    type: [DocumentVersionDto],
  })
  @ValidateNested({ each: true })
  @Type(() => DocumentVersionDto)
  versions: DocumentVersionDto[];

  @Expose()
  @ApiProperty({
    description: 'Current version number',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  currentVersion: number;

  @Expose()
  @ApiProperty({
    description: 'Document status',
    enum: DocumentStatus,
    example: DocumentStatus.ACTIVE,
  })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @Expose()
  @ApiProperty({
    description: 'Creation timestamp',
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

  constructor(partial: Partial<DocumentResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class DownloadUrlResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Signed download URL',
    example: 'https://storage.example.com/documents/abc123?signature=...',
  })
  @IsString()
  url: string;

  @Expose()
  @ApiProperty({
    description: 'URL expiration time in seconds',
    example: 3600,
  })
  @IsNumber()
  @Min(1)
  @Max(86400)
  expiresIn: number;

  constructor(partial: Partial<DownloadUrlResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Minimal document response for list views
 */
@Exclude()
export class DocumentListItemDto {
  @Expose()
  @ApiProperty({
    description: 'Document unique identifier',
    example: 'doc_abc123',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Document type',
    enum: DocumentType,
    example: DocumentType.DEED,
  })
  @IsEnum(DocumentType)
  type: DocumentType;

  @Expose()
  @ApiProperty({
    description: 'Document title',
    example: 'Property Deed 2024',
  })
  @IsString()
  title: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated property ID',
    example: 'prop_abc123',
  })
  @IsOptional()
  @IsString()
  propertyId?: string;

  @Expose()
  @ApiProperty({
    description: 'Document status',
    enum: DocumentStatus,
    example: DocumentStatus.ACTIVE,
  })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @Expose()
  @ApiProperty({
    description: 'Current version number',
    example: 1,
  })
  @IsNumber()
  currentVersion: number;

  @Expose()
  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  constructor(partial: Partial<DocumentListItemDto>) {
    Object.assign(this, partial);
  }
}
