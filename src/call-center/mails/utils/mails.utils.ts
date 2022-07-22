import { formatDate, formatFullDate } from 'src/utils/utils';

export function buildCancellationPollicies(data: any[]) {
  const newData: any[] = data.map((cancellationPolicy: any) => {
    return {
      title: cancellationPolicy?.text,
      toDate: formatDate(cancellationPolicy?.toDate),
      amount: cancellationPolicy?.amount,
    };
  });
  return newData;
}
export function buildFlight(data: any[]) {
  const newData: any[] = data[0].flight_booking_segment.map((flight: any) => {
    return {
      departure: flight?.departure,
      arrival: flight?.arrival,
      departure_at: flight?.departure_at,
      arrival_at: flight?.arrival_at,
    };
  });
  const infoFlight: any = {
    segmentFlight: newData.map((x) => x.departure).join(' - ') + ' - ' + newData[newData.length - 1].arrival,
    segmentDate: formatFullDate(newData[0].departure_at) + ' - ' + formatFullDate(newData[newData.length - 1].arrival_at),
  };
  return infoFlight;
}

export function buildPassengers(data: any[]) {
  let adults = 0;
  let kids = 0;

  data.forEach((passenger: any) => {
    passenger.type.toUpperCase() === 'ADULT' ? adults++ : kids++;
  });

  const infoPassengers: any = {
    adults,
    kids,
  };
  return infoPassengers;
}

export function buildPayments(priceHistory: any[], data: any[], bookingServise: any) {
  const price: any[] = priceHistory
    .filter((x) => x.is_cancellation_policies === false)
    .sort((a, b) => {
      return b.id - a.id;
    });
  console.log('price[0]', price[0]);
  const totalBooking = price.length > 0 ? +price[0].amount.toFixed(2) : +bookingServise.total_pvp.toFixed(2);

  const totalPaymentsPaid = +data
    .filter((x) => {
      return ['COMPLETED', 'COMPLETED_AGENT'].includes(x.status);
    })
    .reduce((previousValue, currentValue) => previousValue + currentValue.paid_amount, 0)
    .toFixed(2);

  const cancellationFees = price.length > 0 ? +bookingServise.total_pvp.toFixed(2) : 0;
  const totalReimbursed = totalPaymentsPaid - cancellationFees;

  const infoPayments: any = {
    totalBooking,
    totalPaymentsPaid,
    cancellationFees,
    totalReimbursed,
  };
  return infoPayments;
}
