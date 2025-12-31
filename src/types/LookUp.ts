export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  createdOn: string;          // ISO datetime
  createdBy: string;
  updatedOn: string;          // ISO datetime
  updatedBy: string;
  status: number;
  isActive: number;
  isDefault: number;
  documentType: string;
  parentId: string;
  documentName: string;
  shelfLife: number;
  isSAP: number;
  parentName: string;
  parentDocumentId: string;
  parentDocumentName: string;
  nameDescription: string;
}

export type DocumentResponse = DocumentItem[];