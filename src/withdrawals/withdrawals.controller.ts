import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalStatusDto } from './dto/update-withdrawal-status.dto';
import { GetWithdrawalsDto } from './dto/get-withdrawals.dto';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  async createWithdrawal(@Body() payload: CreateWithdrawalDto) {
    return this.withdrawalsService.createWithdrawal(payload);
  }

  @Get()
  async listWithdrawals(@Query() query: GetWithdrawalsDto) {
    return this.withdrawalsService.getWithdrawals(query);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() payload: UpdateWithdrawalStatusDto) {
    return this.withdrawalsService.updateWithdrawalStatus(id, payload);
  }
}
