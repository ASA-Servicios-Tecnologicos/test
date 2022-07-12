import { logger } from '../logger';

export function getCodeMethodType(methodType: string) {
  logger.info(`[utils] [getCodeMethodType] --methodType ${methodType}`);

  let id: number;
  switch (methodType) {
    case 'CARD':
      id = 4;
      break;
    case 'BANK_TRANSFER':
      id = 2;
      break;
    case 'BIZUM':
      id = 5;
      break;
    default:
      id = 5;
      break;
  }

  return id;
}
