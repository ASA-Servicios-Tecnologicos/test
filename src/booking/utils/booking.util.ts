import { CheckoutPassenger } from './../../shared/dto/checkout.dto';
import moment from 'moment';

export function buildBookingRequest(productTokenNewblue: any, agencyInfo: any, distributionRooms: any, paxes: any[]) {
  //{ clientReference: '123456', agent: 'Tecnoturis' };

  const mappedPassengers = JSON.stringify(this.buildPassengers(distributionRooms, paxes));

  return `{
      "token":"${productTokenNewblue}",
      "clientReference":"${agencyInfo.clientReference}",
      "agent":"${agencyInfo.agent}",
      "distributions":${mappedPassengers}
  }`;
}

export function buildPassengers(distribution: any, paxes: any[]) {
  return distribution.map((distribu: any) => {
    const paxess = distribu.passengers.map((item: any) => {
      const mappedPax = paxes.find((fly) => fly.code === Number(item.code));

      const [dd, mm, yyyy] = mappedPax.birthdate.split('/');

      const dateBirth = yyyy + '-' + mm + '-' + dd;

      let years = moment().diff(dateBirth, 'years');

      let expiredDocument = '';
      if (mappedPax.documentExpirationDate) {
        const [dds, mms, yyyys] = mappedPax.documentExpirationDate.split('/');
        expiredDocument = yyyys + '-' + mms + '-' + dds;
      }

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
      code: distribu.code,
      passengers: paxess,
    };
  });
}
