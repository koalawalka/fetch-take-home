import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Receipt,
  ReceiptRequest,
  GetPointsResponse,
  ProcessReceiptResponse,
} from './receipt.model';
import { v4 as uuid } from 'uuid';
import {
  processItemDescription,
  processAlphanumericCharacters,
  processDateIsOdd,
  processTotalMultipleOfQuarter,
  processTimeBetween2PMAnd4PM,
  processItemsMultiplesOfTwos,
  processTotalRoundNumber,
} from './utils/receipt-utils';

@Injectable()
export class ReceiptService {
  receiptsInMemory = new Map<string, Receipt>();

  processReceipt(request: ReceiptRequest): ProcessReceiptResponse {
    const id = uuid();

    const processedReceipt: Receipt = {
      id: id,
      points: this.calculatePoints(request),
      ...request,
    };

    this.receiptsInMemory.set(id, processedReceipt);

    return { id: id };
  }

  /**
   * Calculates how many points a receipt is worth based on a set of rules. 
   * @see https://github.com/fetch-rewards/receipt-processor-challenge#rules for given rules.
   * 
   * @param receipt the receipt to calculate points for
   * @returns final calculation of points for given receipt
   */
  calculatePoints(receipt: ReceiptRequest): number {
    let total = 0;
    // One point for every alphanumeric character in the retailer name.
    total += processAlphanumericCharacters(receipt.retailer);

    // 50 points if the total is a round dollar amount with no cents.
    total += processTotalRoundNumber(receipt.total);

    // 25 points if the total is a multiple of 0.25.
    total += processTotalMultipleOfQuarter(parseFloat(receipt.total));

    // 5 points for every two items on the receipt.
    total += processItemsMultiplesOfTwos(receipt.items.length);

    // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round
    // up to the nearest integer. The result is the number of points earned.
    total += processItemDescription(receipt.items);

    // 6 points if the day in the purchase date is odd.
    total += processDateIsOdd(receipt.purchaseDate);

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    total += processTimeBetween2PMAnd4PM(receipt.purchaseTime);

    return total;
  }

  getPoints(id: string): GetPointsResponse {
    const receipt = this.receiptsInMemory.get(id);

    if (!receipt) {
      throw new HttpException("No receipt found for that id", HttpStatus.NOT_FOUND);
    }

    return { points: receipt.points };
  }
}
