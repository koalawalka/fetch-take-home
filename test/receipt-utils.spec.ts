import { Item } from '../src/receipt.model';
import {
  processAlphanumericCharacters,
  processDateIsOdd,
  processItemDescription,
  processItemsMultiplesOfTwos,
  processTimeBetween2PMAnd4PM,
  processTotalMultipleOfQuarter,
  processTotalRoundNumber,
} from '../src/utils/receipt-utils';

describe('processAlphanumericCharacters', () => {
  test('given a string with only numbers returns the length of the string', () => {
    expect(processAlphanumericCharacters('12345')).toBe(5);
  });

  test('given a string with only alphabetical characters returns the length of the string', () => {
    expect(processAlphanumericCharacters('abcde')).toBe(5);
  });

  test('given a string with only lower case alphabetical characters returns the length of the string', () => {
    expect(processAlphanumericCharacters('abcde')).toBe(5);
  });

  test('given a string with only upper case alphabetical characters returns the length of the string', () => {
    expect(processAlphanumericCharacters('ABCDE')).toBe(5);
  });

  test('given a string with alphanumeric characters returns the length of the string', () => {
    expect(processAlphanumericCharacters('abc123')).toBe(6);
    expect(processAlphanumericCharacters('ABC123')).toBe(6);
  });

  test('given an empty string returns 0', () => {
    expect(processAlphanumericCharacters('')).toBe(0);
  });

  test('given a string with invalid characters returns length without those invalid characters included', () => {
    expect(processAlphanumericCharacters('123-ab')).toBe(5);
  });
});

describe('processTotalRoundNumber', () => {
  test('given a string that is a whole number should return 50', () => {
    expect(processTotalRoundNumber('12')).toBe(50);
    expect(processTotalRoundNumber('0')).toBe(50);
  });

  test('given a string that is not a whole number should return 0', () => {
    expect(processTotalRoundNumber('12.5')).toBe(0);
  });

  test('given an empty string should return 0', () => {
    expect(processTotalRoundNumber('')).toBe(0);
  });
});

describe('processTotalMultipleOfQuarter', () => {
  test('given a number that is a multiple of .25 should return 25', () => {
    expect(processTotalMultipleOfQuarter(1)).toBe(25);
  });

  test('given a number that is not a multiple of .25 should return 0', () => {
    expect(processTotalMultipleOfQuarter(1.1)).toBe(0);
    expect(processTotalMultipleOfQuarter(0)).toBe(0);
  });
});

describe('processItemsMultiplesOfTwos', () => {
  test('given the number 4 should return 10', () => {
    expect(processItemsMultiplesOfTwos(4)).toBe(10);
  });

  test('given the number 5 should return 10', () => {
    expect(processItemsMultiplesOfTwos(4)).toBe(10);
  });
});

describe('processItemDescription', () => {
  test('given 1 item with a description length divisible by 3 returns the ceiling of .2 * price', () => {
    const item: Item = {
      shortDescription: '123',
      price: '1',
    };
    expect(processItemDescription([item])).toBe(1);
  });

  test('given 2 items where one has a description length divisible by 3 and the other does not \
          returns the ceiling of .2 * price for the one item', () => {
    const item1: Item = {
      shortDescription: '123',
      price: '1',
    };

    const item2: Item = {
      shortDescription: '1234',
      price: '1',
    };
    expect(processItemDescription([item1, item2])).toBe(1);
  });

  test('given 2 items where both have a description length divisible by 3 \
          returns the ceiling of .2 * price for both items', () => {
    const item1: Item = {
      shortDescription: '123',
      price: '1',
    };

    const item2: Item = {
      shortDescription: '456',
      price: '1',
    };
    expect(processItemDescription([item1, item2])).toBe(2);
  });
});

describe('processDateIsOdd', () => {
  test('given a valid date with an odd day returns 6', () => {
    expect(processDateIsOdd('2022-12-21')).toBe(6);
  });

  test('given a valid date with an even day returns 0', () => {
    expect(processDateIsOdd('2022-12-20')).toBe(0);
  });

  test('given an invalid date throws an error', () => {
    expect(() => processDateIsOdd('2022-12')).toThrow(
      'The date does not follow the xxxx-xx-xx format',
    );
  });
});

describe('processTimeBetween2PMAnd4PM', () => {
  test('given a string time between 2pm and 4pm returns 10', () => {
    expect(processTimeBetween2PMAnd4PM('14:10')).toBe(10);
  });

  test('given a string time before 2 PM returns 0', () => {
    expect(processTimeBetween2PMAnd4PM('12:10')).toBe(0);
  });

  test('given a string time after 4 PM returns 0', () => {
    expect(processTimeBetween2PMAnd4PM('16:10')).toBe(0);
  });

  test('given an invalid string throws an error', () => {
    expect(() => processTimeBetween2PMAnd4PM('invalid string')).toThrow(
      'The time given does not follow the xx:xx format',
    );
    expect(() => processTimeBetween2PMAnd4PM('25:00')).toThrow(
      'The time given is not valid',
    );
  });
});
