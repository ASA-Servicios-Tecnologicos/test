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
  const distributions = JSON.stringify(buildDistributions(distributionRooms, passengers)); //se cambia paxes por passengers

  return `{
      "token":"${productTokenNewblue}",
      "clientReference":"${agencyInfo.clientReference}",
      "agent":"${agencyInfo.agent}",
      "distributions":${distributions}
  }`;
}

export function buildDistributions(distributionRooms: any, paxes: any[]) {
  return distributionRooms.map((distributionRoom: any) => {
    const newPaxes = distributionRoom.passengers.map((item: any) => {
      const mappedPax = paxes.find((fly) => fly.code === Number(item.code));

      const years = buildYears(mappedPax);
      const dateBirth = buildDateBirth(mappedPax);
      const expiredDocument = buildExpiredDocument(dateBirth);

      const dataExtra = [
        {
          code: 'MAIL',
          value: mappedPax.email,
        },
        {
          code: 'EXPIRATION_DATE',
          value: expiredDocument,
        },
        {
          code: 'DOCUMENT_VALUE',
          value: mappedPax.documentNumber,
        },
        {
          code: 'NATIONALITY',
          value: mappedPax.nationality,
        },
        {
          code: 'PHONE',
          value: mappedPax.phone,
        },
      ];

      const dataExtraPax = dataExtra.filter((f) => f.value != '');

      return {
        holder: false,
        code: `${mappedPax.code}`,
        age: mappedPax.type == 'Adult' ? years : mappedPax.ages,
        gender: mappedPax.abbreviation == 'Mr' ? 'MALE' : 'FEMALE',
        name: mappedPax.name || 'p',
        surname: mappedPax.lastname || 'p',
        dateOfBirth: `${dateBirth}`,
        extraData: dataExtraPax,
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
