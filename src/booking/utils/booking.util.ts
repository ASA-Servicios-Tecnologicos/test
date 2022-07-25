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
  const distributions = JSON.stringify(buildDistributions(distributionRooms, passengers, infoRequirements));

  return `{
      "token":"${productTokenNewblue}",
      "clientReference":"${agencyInfo.clientReference}",
      "agent":"${agencyInfo.agent}",
      "distributions":${distributions}
  }`;
}

export function buildDistributions(distributionRooms: any, passengers: any[], infoRequirements: any[]) {
  logger.info(`[buildBookingRequest] [buildDistributions] init method --distributionRooms ${JSON.stringify(distributionRooms)}`);
  return distributionRooms.map((distributionRoom: any) => {
    const newPassengers = distributionRoom.passengers.map((item: any) => {
      const passengerFound = passengers.find((passenger) => passenger.extCode == item.code);

      const dataExtra = buildExtraData(passengerFound, infoRequirements);

      return {
        holder: passengerFound.extCode == 1 ? true : false,
        code: passengerFound.extCode || '',
        age: passengerFound.age || 0,
        gender: passengerFound.gender || '',
        name: passengerFound.name || '',
        surname: passengerFound.lastname || '',
        dateOfBirth: passengerFound.dob || '',
        extraData: dataExtra || [],
      };
    });

    return {
      code: distributionRoom.code,
      passengers: newPassengers,
    };
  });
}

// const years = buildYears(mappedPax);
// const dateBirth = buildDateBirth(mappedPax);
// const expiredDocument = buildExpiredDocument(dateBirth);

export function buildPassengers(passengersCheckout: any[]) {
  logger.info(`[buildBookingRequest] [buildPassengers] init method --passengersCheckout ${JSON.stringify(passengersCheckout)}`);
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
      country: passenger.country,
      room: passenger.room,
      age: buildYears(passenger.dob), //passenger.age,
      extCode: passenger.extCode,
      type: passenger.type,
    };
  });
}

//En el campo extraData solo valos los campos que no son requeridos, y extradata parece ser opcional.
export function buildExtraData(passengerFound: any, infoRequirements: any[]) {
  logger.info(`[buildBookingRequest] [buildExtraData] init method --passengerFound ${JSON.stringify(passengerFound)}`);
  const extraDatas: any[] = [
    //Fijos not sent
    // {
    //   code: 'GENDER',
    //   value: passengerFound.gender,
    // },
    // {
    //   code: 'NAME',
    //   value: passengerFound.name,
    // },
    // {
    //   code: 'SURNAME',
    //   value: passengerFound.lastname,
    // },
    // {
    //   code: 'DATEOFBIRTH',
    //   value: passengerFound.dob,
    // },
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

  return extraDatas.filter((extra) => extra.value && codesFilter.includes(extra.code));
}

export function buildYears(dateBirth: any) {
  return moment().diff(dateBirth, 'years');
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
