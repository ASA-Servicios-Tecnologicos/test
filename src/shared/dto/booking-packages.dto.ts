export interface PostPreBookingsPackagesProvidersDTO {
  requestToken: string;
  providerToken: string;
  packageId: string;
  roomId: string;
  productNewBluee: ProductNewBluee;
}

interface ProductNewBluee {
  TokenProduct: string;
  DistributionsRooms: DistributionsRoom[];
  HotelToken: string;
  IdaFlight: string;
  ReturnFlight: string;
  IdaTransfer: string;
  ReturnTransfer: string;
  ServicesExtras: ServicesExtra[];
}

interface ServicesExtra {
  token: string;
}

interface DistributionsRoom {
  code: number;
  passengers: Passenger[];
}

interface Passenger {
  holder: boolean;
  code: number;
  age: number;
  gender?: any;
  name?: any;
  surname?: any;
  dateOfBirth?: any;
  extraData: any[];
}

export interface PreBookingsPackagesProvidersResponseDTO {
  data: PreBookingsPackagesProvidersDataDTO;
  status: number;
}

interface PreBookingsPackagesProvidersDataDTO {
  bookId: string;
  productTokenNewblue: string;
  requestToken: string;
  providerToken: string;
  distributionRooms: DistributionRoom[];
  agency: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  discountPrice: number;
  discountPriceInfo?: any;
  pendingAmount: number;
  currency: string;
  commission: Commission;
  detailedPricing: DetailedPricing;
  distribution: Distribution[];
  hashPrebooking: string;
  productCode: string;
  productName: string;
  passengers: DistributionRoom[];
  cancellationPolicyList: CancellationPolicyList[];
  hotels: Hotel[];
  flights: Flight[];
  transfers: Transfer[];
  providerName: string;
  rules: Rules;
}

interface Rules {
  type: string;
  uuid: string;
  amount: number;
  endDate: string;
  startDate: string;
  codeProduct: string;
  destination: string;
  providerService: number;
}

interface Transfer {
  packageBookId?: any;
  transferBookId: string;
  productCode: string;
  dateAt: string;
  description: string;
  origin: string;
  destination?: any;
  price: Price;
  images: any[];
  selected: boolean;
}

interface Price {
  passengerRequirement: string;
  optionToken?: any;
  status: string;
  isCancellable: boolean;
  subcategoryList: string;
  servicePrice: ServicePrice;
}

interface ServicePrice {
  total: Total;
}

interface Total {
  amount: number;
  currency: string;
}

interface Flight {
  totalPrice: number;
  outward: Outward[];
  return: Outward[];
  id: number;
  packageBookId: string;
  flightBookId: string;
  selected: boolean;
}

interface Outward {
  departure: Departure;
  arrival: Departure;
  segmentList: SegmentList[];
  company: Company;
  flightClass: FlightClass;
}

interface FlightClass {
  classId?: any;
  className: string;
  classStatus?: any;
}

interface Company {
  companyId: string;
  companyName: string;
  operationCompanyCode: string;
  operationCompanyName?: any;
  transportNumber: string;
}

interface SegmentList {
  origin: string;
  destination: string;
  dateAt: string;
}

interface Departure {
  date: string;
  airportCode: string;
  offset: Offset;
  airportDescription?: any;
  country?: any;
}

interface Offset {
  gmt: number;
  dst: number;
}

interface Hotel {
  hotelId: string;
  rooms: Room[];
  currency: string;
  facilities: any[];
  photos: string[];
  name: string;
  address: string;
  phones: any[];
  description: string;
  city: string;
  categoryPackage: string;
  productCode: string;
  productName: string;
  location: Location;
  providers: Provider[];
  category: Category2;
  selected: boolean;
  providerCode: string;
  partyInfo: string;
  extras: Extra[];
}

interface Extra {
  name: string;
}

interface Category2 {
  name: string;
  value: string;
}

interface Provider {
  providerName: string;
  image: string;
  url: string;
  rooms: any[];
  cheapest: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Room {
  category: Category;
  rates: Rate[];
  name: string;
  selected: boolean;
  packageInformation?: any;
}

interface Rate {
  adults: number;
  cancellationPolicies: any[];
  category: string;
  children: number;
  childrenAges: any[];
  comments: string;
  currency: string;
  paymentType: string;
  price: number;
  detailedPricing: DetailedPricing;
  rooms: number;
  status: string;
}

interface Category {
  quantity: string;
  roomType: string;
}

interface CancellationPolicyList {
  amount: number;
  fromDate: string;
  toDate: string;
  currency?: string;
  type?: string;
  text: string;
}

interface Distribution {
  rooms: number;
  adults: number;
  children: any[];
}

interface DetailedPricing {
  commissionableRate: number;
  nonCommissionableRate: number;
}

interface Commission {
  commissionRate: number;
  fee: number;
  iva: number;
  commission: number;
  pvp: number;
}

interface DistributionRoom {
  code: number;
  passengers: Passenger[];
}

interface Passenger {
  holder: boolean;
  code: number;
  age: number;
  gender?: any;
  name?: any;
  surname?: any;
  dateOfBirth?: any;
  extraData: any[];
}
