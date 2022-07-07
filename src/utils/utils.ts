import { logger } from '../logger';

export function getCodeMethodType(methodType: string) {
  logger.info(`[utils] [getCodeMethodType] --methodType ${methodType}`);

  let code: number;
  switch (methodType) {
    case 'CARD':
      code = 4;
      break;
    case 'BANK_TRANSFER':
      code = 2;
      break;
    default:
      //Bizum
      code = 7; //Este id debe cambiar, dependiendo de la id que se genere en la base de datos
      break;
  }

  return code;
}
