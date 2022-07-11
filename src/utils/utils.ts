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
      id = 7; //Este id debe cambiar, dependiendo de la id que se genere en la base de datos
      break;
    default:
      id = 4;
      break;
  }

  return id;
}
