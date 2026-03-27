import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto, WithdrawalStatus } from './dto/update-withdrawal-status.dto';

const statusTransitions: Record<WithdrawalStatus, WithdrawalStatus[]> = {
  PENDING: [WithdrawalStatus.APPROVED, WithdrawalStatus.REJECTED],
  APPROVED: [WithdrawalStatus.PAID],
  REJECTED: [],
  PAID: [],
};

@Injectable()
export class WithdrawalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWithdrawal(dto: CreateWithdrawalDto) {
    const project = await (this.prisma as any).property.findUnique({ where: { id: dto.projectId } });
    if (!project) {
      throw new NotFoundException(`Project not found: ${dto.projectId}`);
    }

    return (this.prisma as any).withdrawal.create({
      data: {
        projectId: dto.projectId,
        amount: dto.amount as any,
        transactionHash: dto.transactionHash,
        status: WithdrawalStatus.PENDING,
      },
    });
  }

  async getWithdrawals(query: { scope?: string; projectId?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = {};

    if (query.scope === 'project' || (query.projectId && !query.scope)) {
      if (!query.projectId) {
        throw new BadRequestException('projectId is required for project scope');
      }
      where.projectId = query.projectId;
    }

    const withdrawals = await (this.prisma as any).withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await (this.prisma as any).withdrawal.count({ where });

    return {
      data: withdrawals,
      total,
      page,
      limit,
    };
  }

  async updateWithdrawalStatus(withdrawalId: string, dto: UpdateWithdrawalStatusDto) {
    const existing = await (this.prisma as any).withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!existing) {
      throw new NotFoundException(`Withdrawal not found: ${withdrawalId}`);
    }

    if (existing.status === dto.status) {
      return existing;
    }

    const allowed = statusTransitions[existing.status as WithdrawalStatus];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(`Invalid status transition from ${existing.status} to ${dto.status}`);
    }

    return (this.prisma as any).withdrawal.update({
      where: { id: withdrawalId },
      data: { status: dto.status },
    });
  }
}
