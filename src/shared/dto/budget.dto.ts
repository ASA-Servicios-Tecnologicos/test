import { ApiParam, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ManagementBookingServiceDTO } from './booking-service.dto';
import { PolicyType, DiscountDTO } from './booking.dto';
import { ManagementClientDTO } from './management-client.dto';
import { OtaClientDTO } from './ota-client.dto';

export class ManagementBudgetPackageDataComments {
  clientComment: string = '';
  agentComment: string = '';
  updatedPrice: number;
}
export class ManagementBudgetCancellationPolicyDto {
  amount: number;
  fromDate: string;
  toDate: string;
  currency?: any;
  type: PolicyType;
  text: string;
}
export class ManagementBudgetPassengerDTO {
  holder: boolean;
  code: string;
  age: number;
  gender?: any;
  name?: any;
  surname?: any;
  dateOfBirth?: any;
  extraData: [] = [];
}
export class ManagementBudgetDistributionDTO {
  rooms: number;
  adults: number;
  children: [] = [];
}
export class ManagementBudgetTransferServicePriceDTO {
  total: {
    amount: number;
    currency: string;
  };
}
export class ManagementBudgetTransferPriceDTO {
  passengerRequirement: string = '';
  optionToken?: any;
  status: string;
  isCancellable: boolean;
  subcategoryList: string = '';
  servicePrice: ManagementBudgetTransferServicePriceDTO;
}

export class ManagementBudgetTransferDTO {
  packageBookId?: any;
  transferBookId: string;
  productCode: string;
  dateAt: Date;
  description: string;
  origin: string;
  destination?: any;
  price: ManagementBudgetTransferPriceDTO;
  images: [] = [];
  selected: boolean;
}
export class ManagementBudgetFlightOutwardReturnFlightClassDTO {
  classId?: string;
  className: string;
  classStatus?: string;
}
export class ManagementBudgetFlightOutwardReturnCompanyDTO {
  companyId: string;
  companyName: string;
  operationCompanyCode: string;
  operationCompanyName?: string;
  transportNumber: string;
}
export class ManagementBudgetFlightOutwardReturnSegmentDTO {
  origin: string;
  destination: string;
  dateAt: Date;
}
export class ManagementBudgetFlightOutwardReturnMomentOffsetDTO {
  gmt: number;
  dst: number;
}
export class ManagementBudgetFlightOutwardReturnMomentDTO {
  date: Date;
  airportCode: string;
  offset: ManagementBudgetFlightOutwardReturnMomentOffsetDTO;
  airportDescription?: string;
  country?: string;
}

export class ManagementBudgetFlightOutwardReturnDTO {
  departure: ManagementBudgetFlightOutwardReturnMomentDTO;
  arrival: ManagementBudgetFlightOutwardReturnMomentDTO;
  segmentList: ManagementBudgetFlightOutwardReturnSegmentDTO[];
  company: ManagementBudgetFlightOutwardReturnCompanyDTO;
}

export class ManagementBudgetFlightDTO {
  id: number;
  packageBookId: string = '';
  flightBookId: string = '';
  selected: boolean;
  totalPrice: number;
  outward: ManagementBudgetFlightOutwardReturnDTO[];
  return: ManagementBudgetFlightOutwardReturnDTO[];
}

export class ManagementBudgetHotelCategoryDTO {
  name: string;
  value: string;
}

export class ManagementBudgetHotelProviderDTO {
  providerName: string;
  image: string;
  url: string;
  rooms: [] = [];
  cheapest: boolean;
}

export class ManagementBudgetHotelLocationDTO {
  latitude?: any;
  longitud?: any;
}

export class ManagementBudgetRoomRateDetailedPricingDTO {
  commissionableRate: number;
  nonCommissionableRate: number;
  commissionAmount: number;
  commissionTaxesAmount: number;
  commissionTaxesIncluded: boolean;
  netAmount: number;
  commission?: number;
  discount?: number;
  totalAmount?: number;
}

export class ManagementBudgetRoomRateDTO {
  adults: number;
  cancellationPolicies: [] = [];
  category: string;
  children: number;
  childrenAges: [] = [];
  comments: string;
  currency: string;
  paymentType: string;
  price: number;
  detailedPricing: ManagementBudgetRoomRateDetailedPricingDTO;
  rooms: number;
  status: string;
}

export class ManagementBudgetRoomCategoryDTO {
  quantity: string;
  roomType: string;
}

export class ManagementBudgetRoomDTO {
  category: ManagementBudgetRoomCategoryDTO;
  rates: ManagementBudgetRoomRateDTO[];
  name: string;
  selected: boolean;
  //TODO: Tipo any de momento. Se debe definir tipo de dato si llega, ya que en el management no se esta enviando
  packageInformation?: any;
}

export class ManagementBudgetHotelDTO {
  hotelId: string;
  rooms: ManagementBudgetRoomDTO[];
  currency: string;
  facilities: [];
  photos: string[];
  name: string;
  address: string;
  phones: [] = [];
  description: string;
  city: string;
  categoryPackage: string;
  location: ManagementBudgetHotelLocationDTO;
  providers: ManagementBudgetHotelProviderDTO[];
  category: ManagementBudgetHotelCategoryDTO;
  selected: boolean;
  providerCode: string;
  partyInfo: string;
  extras: [] = [];
  remarks: Array<{ type: any; text: string }>;
}

export class ManagementBudgetPackageDataDTO {
  bookId?: string;
  status?: string;
  uuid: string;
  client?: number;
  totalAmount: number;
  hotels: ManagementBudgetHotelDTO[];
  flights: ManagementBudgetFlightDTO[];
  transfers: ManagementBudgetTransferDTO[];
  distribution: ManagementBudgetDistributionDTO[];
  productTokenNewblue: string;
  passengers: Array<any>;
  newsletter?: boolean;
  commission: {
    pvp: number;
  };
  agencyInfo?: {
    agentNum: string;
    expediente: string;
  };
  distributionRooms?: Array<{
    code: string;
    passengers: ManagementBudgetPassengerDTO[];
  }>;
  checkIn: string;
  checkOut: string;
  cancellationPolicyList: ManagementBudgetCancellationPolicyDto[];
  currency: string;
  paxes;
  integrationType: string;
  adults: number;
  children: number;
  infants: number;
  providerToken: string;
  requestToken: string;
  packageClient?: any;
  partialTotal: number;
  providerName: string;
  productName?: string;
  detailedPricing: ManagementBudgetRoomRateDetailedPricingDTO;
  validateMessage: string;
  checkForm: boolean;
  isSelected: boolean;
  canBeBooked: boolean;
  comments: ManagementBudgetPackageDataComments;
  flightDurationOutward: string;
  flightDurationReturn: string;
  infoAirports: {
    airportOriginCity: string;
    airportOriginName: string;
    airportArrivalCity: string;
    airportArrivalName: string;
  };
  checkoutId: string;
  discount: DiscountDTO;
}

export class CreateManagementBudgetDto {
  packageData: ManagementBudgetPackageDataDTO[];
  client: number;
}

export class CreateBudgetDto {
  @ApiProperty()
  client: OtaClientDTO;
  // TODO: Pending type data
  @ApiProperty()
  preBookings: any;
}

export class ManagementBudgetDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  dossier_pax: [];
  @ApiProperty()
  code: string;
  @ApiProperty()
  total_amount: number;
  @ApiProperty()
  total_abono: number;
  @ApiProperty()
  total_services: number;
  @ApiProperty()
  total_discount: number;
  @ApiProperty()
  net_amount: number;
  @ApiProperty()
  total_charged: number;
  @ApiProperty()
  total_payments: number;
  @ApiProperty()
  total_fees: number;
  @ApiProperty()
  pending_charged: number;
  @ApiProperty()
  pending_payment: number;
  @ApiProperty()
  client_name: string;
  @ApiProperty()
  client_type: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  creation_date: Date;
  @ApiProperty()
  created_by: string;
  @ApiProperty()
  update_date: Date;
  @ApiProperty()
  update_by: string;
  @ApiProperty()
  code_agency: number;
  @ApiProperty({ example: null })
  total?: any;
  @ApiProperty()
  opening_date: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  year: number;
  @ApiProperty({ example: null })
  observation?: any;
  @ApiProperty()
  total_amount_without_service: number;
  @ApiProperty()
  total_abono_without_service: number;
  @ApiProperty()
  sent_to_sap: boolean;
  @ApiProperty()
  client: ManagementClientDTO;
  @ApiProperty({ example: null })
  dossier_status?: any;
  @ApiProperty()
  dossier_budget_status: number;
  @ApiProperty({ example: null })
  dossier_situation?: any;
  @ApiProperty()
  agency: number;
  @ApiProperty({ example: null })
  reference?: any;
  @ApiProperty()
  pax_reserves: number;
}

export class BudgetDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  dossier_pax: [];
  @ApiProperty()
  code: string;
  @ApiProperty()
  total_amount: number;
  @ApiProperty()
  total_abono: number;
  @ApiProperty()
  total_services: number;
  @ApiProperty()
  total_discount: number;
  @ApiProperty()
  net_amount: number;
  @ApiProperty()
  total_charged: number;
  @ApiProperty()
  total_payments: number;
  @ApiProperty()
  total_fees: number;
  @ApiProperty()
  pending_charged: number;
  @ApiProperty()
  pending_payment: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  creation_date: Date;
  @ApiProperty()
  created_by: string;
  @ApiProperty()
  update_date: Date;
  @ApiProperty()
  update_by: string;
  @ApiProperty()
  code_agency: number;
  @ApiProperty({ example: null })
  total?: any;
  @ApiProperty()
  opening_date: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  year: number;
  @ApiProperty({ example: null })
  observation?: any;
  @ApiProperty()
  total_amount_without_service: number;
  @ApiProperty()
  total_abono_without_service: number;
  @ApiProperty()
  sent_to_sap: boolean;
  @ApiProperty()
  client: ManagementClientDTO;
  @ApiProperty({ example: null })
  dossier_status?: any;
  @ApiProperty()
  dossier_budget_status: number;
  @ApiProperty({ example: null })
  dossier_situation?: any;
  @ApiProperty()
  agency: number;
  @ApiProperty({ example: null })
  reference?: any;
  @ApiProperty()
  pax_reserves: number;
  @ApiProperty()
  services: ManagementBookingServiceDTO[];
  @ApiProperty()
  dossier_payments?: Array<any>;
}
