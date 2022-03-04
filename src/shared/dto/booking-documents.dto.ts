export class GetDocumentsContent {
  bookingReference: string;
  brandCode: string;
  documentIds: string[];
}

export class GetDocuments {
  bookingId: string;
  brandCode: string;
  typeVoucher: 'all' | 'client' | 'agency';
}

export class DocumentsDTO {
  status: number;
  data: Array<DocumentDTO>;
}

export class DocumentDTO {
  documentId: string;
  filename: string;
  url: string;
}
