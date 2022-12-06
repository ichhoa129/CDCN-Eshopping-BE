import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(public paymentService: PaymentService) {}

  @Post('/notify')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Notify payment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notify payment',
  })
  async handleNotify(@Request() req) {
    const { orderId, amount, transId, message, payType, resultCode } = req.body;
    await this.paymentService.handleNotify({
      orderId,
      amount,
      transId,
      message,
      payType,
      resultCode,
    });
  }
}
