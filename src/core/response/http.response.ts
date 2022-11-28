import { Response } from 'express';

export class HttpResponse {
  status: number;

  data: any;

  success = true;

  constructor(status: number, data?: any) {
    this.status = status;
    this.data = data;
  }

  toResponse(res: Response) {
    return res.status(this.status).json(this.toBody(this.data));
  }

  toBody(data: any) {
    return {
      status: this.status,
      data,
    };
  }
}
