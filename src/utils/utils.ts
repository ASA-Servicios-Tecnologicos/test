import { TypeDocument } from './../shared/dto/management-client.dto';
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

export function getCodeTypeDocument(typeDocument: string) {
  logger.info(`[utils] [getCodeTypeDocument] --typeDocument ${typeDocument}`);

  let id: number;
  switch (typeDocument) {
    case TypeDocument.DNI:
      id = 1;
      break;
    case TypeDocument.NIE:
      id = 3;
      break;
    default:
      id = 1;
      break;
  }
  return id;
}

export function formatDate(date: string) {
  return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
}

export function formatFullDate(date: string) {
  if (!isNaN(Date.parse(date))) {
    const newDate = new Date(date);
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(newDate);
  }
}

export function mapFilterParamsToQueryParams(filterParams: any): string {
  let result = '?';

  Object.keys(filterParams).forEach((key, index) => {
    result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
  });

  return encodeURI(result);
}
