import { map } from 'rxjs';
import * as moment from 'moment';
import { logger } from '../../logger';
export function buildBookingRequest(
  productTokenNewblue: string,
  agencyInfo: any,
  distributionRooms: any,
  passengersCheckout: any[],
  infoRequirements: any,
) {
  logger.info(`[buildBookingRequest] init method`);
  //{ clientReference: '123456', agent: 'Tecnoturis' };

  const passengers = buildPassengers(passengersCheckout);
  const distributions = JSON.stringify(buildDistributions(distributionRooms, passengers, infoRequirements)); //se cambia paxes por passengers

  return `{
      "token":"${productTokenNewblue}",
      "clientReference":"${agencyInfo.clientReference}",
      "agent":"${agencyInfo.agent}",
      "distributions":${distributions}
  }`;
}

export function buildDistributions(distributionRooms: any, passengers: any[], infoRequirements: any[]) {
  return distributionRooms.map((distributionRoom: any) => {
    const newPaxes = distributionRoom.passengers.map((item: any) => {
      const passengerFound = passengers.find((passenger) => passenger.code == item.code);

      // const years = buildYears(mappedPax);
      // const dateBirth = buildDateBirth(mappedPax);
      // const expiredDocument = buildExpiredDocument(dateBirth);

      const dataExtra = buildExtraData(passengerFound, infoRequirements);

      return {
        holder: false,
        code: passengerFound.extCode,
        age: passengerFound.age,
        gender: passengerFound.gender || '',
        name: passengerFound.name || '',
        surname: passengerFound.lastname || '',
        dateOfBirth: passengerFound.dateBirth,
        extraData: dataExtra,
      };
    });

    return {
      code: distributionRoom.code,
      passengers: newPaxes,
    };
  });
}

export function buildPassengers(passengersCheckout: any[]) {
  return passengersCheckout.map((passenger) => {
    return {
      passengerId: passenger.passengerId,
      gender: passenger.gender,
      title: passenger.title,
      name: passenger.name,
      lastname: passenger.lastname,
      dob: passenger.dob,
      documentType: passenger.document.documentType,
      documentNumber: passenger.document.documentNumber,
      expirationDate: passenger.document.expirationDate,
      nationality: passenger.document.nationality,
      country: passenger.lastname,
      room: passenger.room,
      age: passenger.age,
      extCode: passenger.extCode,
      type: passenger.type,
    };
  });
}

export function buildExtraData(passengerFound: any, infoRequirements: any[]) {
  const extraDatas: any[] = [
    {
      code: 'GENDER',
      value: passengerFound.gender,
    },
    {
      code: 'NAME',
      value: passengerFound.name,
    },
    {
      code: 'SURNAME',
      value: passengerFound.lastname,
    },
    {
      code: 'DATEOFBIRTH',
      value: passengerFound.dob,
    },
    {
      code: 'DOCUMENT_TYPE',
      value: passengerFound.documentType,
    },
    {
      code: 'DOCUMENT_VALUE',
      value: passengerFound.documentNumber,
    },
    {
      code: 'ISSUE_DATE',
      value: null,
    },
    {
      code: 'ISSUE_COUNTRY',
      value: null,
    },
    {
      code: 'EXPIRATION_DATE',
      value: passengerFound.expirationDate,
    },
    {
      code: 'NATIONALITY',
      value: passengerFound.nationality,
    },
    {
      code: 'ADDRESS',
      value: null,
    },

    {
      code: 'PHONE',
      value: null,
    },

    {
      code: 'MAIL',
      value: null,
    },
  ];

  const codesFilter: string[] = infoRequirements[0].fields.filter((field: any) => field.mandatory).map((field: any) => field.code);

  return extraDatas.filter((extra) => codesFilter.includes(extra.code));
}
export function buildExpiredDocument(mappedPax: any) {
  let expiredDocument = '';

  if (mappedPax.documentExpirationDate) {
    const [dds, mms, yyyys] = mappedPax.documentExpirationDate.split('/');
    expiredDocument = yyyys + '-' + mms + '-' + dds;
  }

  return expiredDocument;
}

export function buildDateBirth(mappedPax: any) {
  const [dd, mm, yyyy] = mappedPax.birthdate.split('/');
  return yyyy + '-' + mm + '-' + dd;
}
export function buildYears(dateBirth: any) {
  return moment().diff(dateBirth, 'years');
}
