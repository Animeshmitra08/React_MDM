export type DocumentBlockStatus = {
  id: string;
  name: string;
  description: string;
  createdOn: string;        // ISO datetime
  createdBy: string | null;
  updatedOn: string | null;
  updatedBy: string | null;
  status: number;
  isActive: number;
  isDefault: number | null;
  documentType: string;
  parentId: string | null;
  documentName: string | null;
  shelfLife: number | null;
  isSAP: number | null;
  parentName: string | null;
  parentDocumentId: string | null;
  parentDocumentName: string | null;
  nameDescription: string;
};