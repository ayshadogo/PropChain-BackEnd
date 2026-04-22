import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/database/prisma.service';
import { UsersService } from '../../src/users/users.service';
import { EmailService } from '../../src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';

describe('AuthService - Password Reset', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let emailService: EmailService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
            },
            passwordResetToken: {
              updateMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            passwordHistory: {
              findMany: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BCRYPT_ROUNDS') return '12';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('requestPasswordReset', () => {
    it('should send reset email for existing user', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        isBlocked: false,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(prismaService.passwordResetToken, 'updateMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.passwordResetToken, 'create').mockResolvedValue({} as any);
      jest.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue();

      await service.requestPasswordReset({ email: 'test@example.com' });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(prismaService.passwordResetToken.updateMany).toHaveBeenCalled();
      expect(prismaService.passwordResetToken.create).toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', expect.any(String));
    });

    it('should not reveal if email does not exist', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await service.requestPasswordReset({ email: 'nonexistent@example.com' });

      expect(usersService.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should not send email to blocked users', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'blocked@example.com',
        isBlocked: true,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      await service.requestPasswordReset({ email: 'blocked@example.com' });

      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockResetToken = {
        id: 'token-id',
        token: 'valid-token',
        userId: 'user-id',
        usedAt: null,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        user: {
          id: 'user-id',
          isBlocked: false,
        },
      };

      const mockTransaction = jest.fn().mockResolvedValue(undefined);

      jest.spyOn(prismaService.passwordResetToken, 'findUnique').mockResolvedValue(mockResetToken as any);
      jest.spyOn(prismaService.passwordHistory, 'findMany').mockResolvedValue([]);
      jest.spyOn(prismaService, '$transaction').mockImplementation(mockTransaction);

      await service.resetPassword({
        token: 'valid-token',
        newPassword: 'NewPassword123!',
      });

      expect(prismaService.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token: 'valid-token' },
        include: { user: true },
      });
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw error for invalid token', async () => {
      jest.spyOn(prismaService.passwordResetToken, 'findUnique').mockResolvedValue(null);

      await expect(service.resetPassword({
        token: 'invalid-token',
        newPassword: 'NewPassword123!',
      })).rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw error for used token', async () => {
      const mockResetToken = {
        id: 'token-id',
        token: 'used-token',
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        user: { id: 'user-id', isBlocked: false },
      };

      jest.spyOn(prismaService.passwordResetToken, 'findUnique').mockResolvedValue(mockResetToken as any);

      await expect(service.resetPassword({
        token: 'used-token',
        newPassword: 'NewPassword123!',
      })).rejects.toThrow('Reset token has already been used');
    });

    it('should throw error for expired token', async () => {
      const mockResetToken = {
        id: 'token-id',
        token: 'expired-token',
        usedAt: null,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        user: { id: 'user-id', isBlocked: false },
      };

      jest.spyOn(prismaService.passwordResetToken, 'findUnique').mockResolvedValue(mockResetToken as any);

      await expect(service.resetPassword({
        token: 'expired-token',
        newPassword: 'NewPassword123!',
      })).rejects.toThrow('Reset token has expired');
    });
  });
});