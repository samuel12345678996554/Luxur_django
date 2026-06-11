export interface ContractDocumentI {
  id?: number;
  contract: number | null;
  name: string;
  file?: File | null;
}

export interface ContractDocumentResponseI {
  id?: number;
  contract: number;
  contract_info?: string;
  name: string;
  file: string;
  uploaded_at?: string;
}