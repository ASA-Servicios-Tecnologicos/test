import {
  ManagementBudgetCancellationPolicyDto,
  ManagementBudgetDistributionDTO,
  ManagementBudgetFlightDTO,
  ManagementBudgetHotelDTO,
  ManagementBudgetPassengerDTO,
  ManagementBudgetRoomRateDetailedPricingDTO,
  ManagementBudgetTransferDTO,
} from './budget.dto';

export interface PrebookingDTO {
  data: {
    bookId: string;
    productTokenNewblue: string;
    requestToken: string;
    providerToken: string;
    productName: string;
    distributionRooms: Array<{
      code: string;
      passengers: ManagementBudgetPassengerDTO[];
    }>;
    agency: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    pendingAmount: number;
    currency: string;
    insurances: Insurances;
    observations: Array<Observation>;
    commision: {
      commission: number;
      iva: number;
      commissionRate: number;
      fee: number;
      pvp: number;
    };
    detailedPricing: ManagementBudgetRoomRateDetailedPricingDTO;
    distribution: ManagementBudgetDistributionDTO[];
    hashPrebooking: string;
    passengers: Array<{
      code: string;
      passengers: ManagementBudgetPassengerDTO[];
    }>;
    cancellationPolicyList: ManagementBudgetCancellationPolicyDto[];
    hotels: ManagementBudgetHotelDTO[];
    flights: ManagementBudgetFlightDTO[];
    transfers: ManagementBudgetTransferDTO[];
    rules: {
      type: 'PERCENTAGE' | 'AMOUNT';
      uuid: string;
      amount: number;
      endDate: string;
      startDate: string;
      codeProduct: string;
      destination: string;
      providerService: number;
    };
    infoRequirements: any;
  };
  status: number;
}

interface Insurances {
  name: string;
  startDate: string;
  endDate: string;
  insured: Insured;
}

interface Insured {
  code: string;
  name: string;
}

interface Observation {
  type?: any;
  text: string;
}
