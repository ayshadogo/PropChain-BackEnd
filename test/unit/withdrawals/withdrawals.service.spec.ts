import { Test } from '@nestjs/testing';
import { WithdrawalsService } from '../../src/withdrawals/withdrawals.service';
import { PrismaService } from '../../src/database/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WithdrawalsService', () => {
  let service: WithdrawalsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      property: {
        findUnique: jest.fn(),
      },
      withdrawal: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        WithdrawalsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get<WithdrawalsService>(WithdrawalsService);
  });

  it('should create a withdrawal when project exists', async () => {
    prismaMock.property.findUnique.mockResolvedValue({ id: 'proj-1' });
    prismaMock.withdrawal.create.mockResolvedValue({ id: 'w1', projectId: 'proj-1', amount: 100, status: 'PENDING', transactionHash: '0xabc' });

    const result = await service.createWithdrawal({ projectId: 'proj-1', amount: 100, transactionHash: '0xabc' } as any);

    expect(result.status).toBe('PENDING');
    expect(prismaMock.withdrawal.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException when project not found', async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);
    await expect(service.createWithdrawal({ projectId: 'proj-1', amount: 100 } as any)).rejects.toThrow(NotFoundException);
  });

  it('should enforce valid status transitions', async () => {
    prismaMock.withdrawal.findUnique.mockResolvedValue({ id: 'w1', status: 'PENDING' });
    prismaMock.withdrawal.update.mockResolvedValue({ id: 'w1', status: 'APPROVED' });

    const updated = await service.updateWithdrawalStatus('w1', { status: 'APPROVED' } as any);
    expect(updated.status).toBe('APPROVED');

    prismaMock.withdrawal.findUnique.mockResolvedValue({ id: 'w1', status: 'PAID' });
    await expect(service.updateWithdrawalStatus('w1', { status: 'APPROVED' } as any)).rejects.toThrow(BadRequestException);
  });
});
