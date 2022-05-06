export interface ContentAPI {
  code: string;
  codeJP: string;
  name: string;
  destination: Destination;
  category: string;
  hotelBoat: boolean;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  images: Image[];
  videos: any[];
  servicesByTypes: ServicesByType[];
  sustainabilities: any[];
}

export interface Destination {
  code: null;
  name: null;
}

export interface Image {
  altText: null;
  size: Size;
  type: string;
  poster: null;
}

export interface Size {
  medium: string;
}

export interface ServicesByType {
  id: string;
  name: string;
  icon: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  paidService: boolean;
}
