/* eslint-disable @typescript-eslint/naming-convention */
import { MOMO_CONFIG } from '@config/momo.config';
import { hash } from 'src/common/utils/crypto';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

export class MomoPayment {
  private static createSignature({
    orderId,
    orderInfo,
    amount,
    requestId,
    extraData = '',
  }) {
    const { accessKey, ipnUrl, partnerCode, redirectUrl, requestType } =
      MOMO_CONFIG;
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    return hash(rawSignature, MOMO_CONFIG.secretKey);
  }

  static async sendRequest({
    orderId,
    amount,
    orderInfo = 'Pay with Momo',
    lang = 'en',
    extraData = '',
  }): Promise<string> {
    const requestId = `${orderId}_${Date.now()}`;
    orderId = `${orderId}_${Date.now()}`;
    const requestBody = JSON.stringify({
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: MOMO_CONFIG.partnerName,
      accessKey: MOMO_CONFIG.accessKey,
      requestType: MOMO_CONFIG.requestType,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      orderId,
      amount,
      orderInfo,
      requestId,
      extraData,
      signature: MomoPayment.createSignature({
        orderId,
        orderInfo,
        amount,
        requestId,
        extraData,
      }),
      lang,
    });

    const response = await axios({
      method: 'POST',
      url: MOMO_CONFIG.paymentUrl,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    }).catch((error) => {
      throw new BadRequestException(error.message);
    });

    return response.data.payUrl;
  }
}
