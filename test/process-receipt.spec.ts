import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from '../src/receipt.controller';
import { ReceiptService } from '../src/receipt.service';
import { ReceiptRequest } from '../src/receipt.model';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AppController', () => {
  let appController: ReceiptController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [ReceiptService],
    }).compile();

    appController = app.get<ReceiptController>(ReceiptController);
  });

  describe('Post and Get operations', () => {
    test('should process a receipt and return the correct points example 1', () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'Target',
        purchaseDate: '2022-01-01',
        purchaseTime: '13:01',
        items: [
          {
            shortDescription: 'Mountain Dew 12PK',
            price: '6.49',
          },
          {
            shortDescription: 'Emils Cheese Pizza',
            price: '12.25',
          },
          {
            shortDescription: 'Knorr Creamy Chicken',
            price: '1.26',
          },
          {
            shortDescription: 'Doritos Nacho Cheese',
            price: '3.35',
          },
          {
            shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
            price: '12.00',
          },
        ],
        total: '35.35',
      };

      const response = appController.processReceipt(receiptRequest);
      expect(response).toHaveProperty('id');

      expect(appController.getPoints(response.id)).toMatchObject({
        points: 28,
      });
    });

    test('Should process a receipt and return the correct points example 2', () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
        ],
        total: '9.00',
      };

      const response = appController.processReceipt(receiptRequest);
      expect(response).toHaveProperty('id');

      expect(appController.getPoints(response.id)).toMatchObject({
        points: 109,
      });
    });

    test('Given a receipt request with an invalid total should fail validation', async () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25',
          },
        ],
        total: 'INVALID TOTAL',
      };
      const errors = await validate(plainToInstance(ReceiptRequest,receiptRequest))

      expect(errors[0].constraints).toMatchObject({
        matches: 'total must match ^\\d+\\.\\d{2}$ regular expression' 
      })
    });

    test('Given a receipt request with no items should fail validation', async () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [],
        total: '10.00',
      };
      const errors = await validate(plainToInstance(ReceiptRequest,receiptRequest))

      expect(errors[0].constraints).toMatchObject({
        arrayMinSize: "items must contain at least 1 elements"
      })
    });

    test('Given a receipt request with an invalid item description should fail validation', async () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
          {
            shortDescription: '"Hello, World!',
            price: '1.25',
          },
        ],
        total: '35.43',
      };
      const errors = await validate(plainToInstance(ReceiptRequest,receiptRequest))

      // check that there is a validation error
      expect(errors.length).toBe(1);
    });

    test('Given a receipt request with an invalid item price should fail validation', async () => {
      const receiptRequest: ReceiptRequest = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
          {
            shortDescription: '"Hello, World!',
            price: 'INVALID',
          },
        ],
        total: '35.43',
      };
      const errors = await validate(plainToInstance(ReceiptRequest,receiptRequest))

      // check that there is a validation error
      expect(errors.length).toBe(1);
    });
  });
});
