import { HttpResponse } from './http.response';
import { HttpStatus } from '@nestjs/common';

export class ValidHttpResponse extends HttpResponse {
  static toOkResponse(data: any) {
    return new HttpResponse(HttpStatus.OK, data);
  }

  static toNoContentResponse() {
    return new HttpResponse(HttpStatus.NO_CONTENT);
  }

  static toCreatedResponse(data?: any) {
    return new HttpResponse(HttpStatus.CREATED, data);
  }
}
