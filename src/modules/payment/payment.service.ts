import { OrderService } from '@app/order/order.service';
import { MomoPayment } from '@core/utils/payment/momo';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MOMO_RESULT_CODE } from 'src/common/enums';
import { ORDER_STATUS } from 'src/common/enums/order.enum';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private paymentRepository: Repository<Payment>,

    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  async payWithMomo(orderId) {
    const order = await this.orderService.findOneById(orderId);

    return MomoPayment.sendRequest({ orderId: order.id, amount: order.total });
  }

  async handleNotify({
    orderId,
    amount,
    transId,
    message,
    payType,
    resultCode,
  }) {
    orderId = Number(orderId.split('_')[0]);

    await this.createOne({ orderId, amount, transId, message, payType });

    if (resultCode === MOMO_RESULT_CODE.SUCCESSFUL) {
      await this.orderService.updateStatus(orderId, ORDER_STATUS.ON_PREPARING);
    } else {
      await this.orderService.updateStatus(orderId, ORDER_STATUS.CANCELLED);
    }
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOneById(id: number): Promise<Payment> {
    const options = {
      where: { id },
    };
    const payment = await this.paymentRepository.findOne(options);

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return payment;
  }

  async createOne(createPaymentDto: CreatePaymentDto) {
    await this.paymentRepository.save(createPaymentDto);
  }

  async deleteOne(id: number) {
    const payment = await this.findOneById(id);

    await this.paymentRepository.delete(payment.id);
  }
}
