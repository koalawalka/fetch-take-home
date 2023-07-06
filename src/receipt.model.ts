import {
  Matches,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @see https://github.com/fetch-rewards/receipt-processor-challenge/blob/main/api.yml for models
 */
export class Item {
  // The Short Product Description for the item.
  @Matches('^[\\w\\s\\-]+$')
  readonly shortDescription!: string;

  //The total price payed for this item.
  @Matches('^\\d+\\.\\d{2}$')
  readonly price!: string;
}

export class ReceiptRequest {
  readonly retailer!: string;

  // todo: Add date regex
  readonly purchaseDate!: string;

  // todo: Add date regex
  readonly purchaseTime!: string;

  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => Item,{})
  readonly items!: Item[];

  @Matches('^\\d+\\.\\d{2}$')
  readonly total!: string;
}

export class Receipt extends ReceiptRequest {
  id!: string;
  points!: number;
}

export class ProcessReceiptResponse {
  readonly id: string;
}

export interface GetPointsResponse {
  readonly points: number;
}
