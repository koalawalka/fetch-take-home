import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import {
  ReceiptRequest,
  GetPointsResponse,
  ProcessReceiptResponse,
} from './receipt.model';

@Controller()
export class ReceiptController {
  constructor(private readonly appService: ReceiptService) {}

  @Post('/receipts/process')
  @HttpCode(200)
  processReceipt(@Body() request: ReceiptRequest): ProcessReceiptResponse {
    return this.appService.processReceipt(request);
  }

  @Get('/receipts/:id/points')
  getPoints(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): GetPointsResponse {
    return this.appService.getPoints(id);
  }
}
