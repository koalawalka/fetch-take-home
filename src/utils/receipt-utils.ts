import { Item } from 'src/receipt.model';

export function processAlphanumericCharacters(str: string): number {
  const alphanumericRegex = /[a-zA-Z0-9]/g;
  const matches = str.match(alphanumericRegex);
  return matches ? matches.length : 0;
}

export function processTotalRoundNumber(total: string): number {
  return Number.isInteger(parseFloat(total)) ? 50 : 0;
}

export function processTotalMultipleOfQuarter(num: number): number {
  return num % 0.25 === 0 && num !== 0 ? 25 : 0;
}

export function processItemsMultiplesOfTwos(itemLength: number): number {
  return Math.floor(itemLength / 2) * 5;
}

// If the trimmed length of the item description is a multiple of 3,
// multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
export function processItemDescription(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (item.shortDescription.trim().length % 3 === 0) {
      total += Math.ceil(parseFloat(item.price) * 0.2);
    }
  }

  return total;
}

export function processDateIsOdd(date: string): number {
  if (!date.includes('-')) {
    throw Error('The date does not follow the xxxx-xx-xx format');
  }

  const splitDate = date.split('-');

  if (splitDate.length !== 3) {
    throw Error('The date does not follow the xxxx-xx-xx format');
  }

  return parseInt(date.split('-')[2]) % 2 === 1 ? 6 : 0;
}

export function processTimeBetween2PMAnd4PM(time: string): number {
  if (!time.includes(':') || time.split(':').length !== 2) {
    throw Error('The time given does not follow the xx:xx format');
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('The time given is not valid');
  }

  // Convert to minutes and check if given time is between bounds
  const timeInMinutes = hours * 60 + minutes;
  const lowerBound = 14 * 60; // 2 PM in minutes
  const upperBound = 16 * 60; // 4 PM in minutes

  const isBetween = timeInMinutes >= lowerBound && timeInMinutes <= upperBound;

  return isBetween ? 10 : 0;
}
