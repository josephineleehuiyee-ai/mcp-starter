export type MarketSegment = 'CCR' | 'RCR' | 'OCR';

export type PropertyType = 
  | 'Condominium' 
  | 'Apartment' 
  | 'Executive Condominium' 
  | 'Detached House' 
  | 'Semi-Detached House' 
  | 'Terrace House';

export type SaleType = 'New Sale' | 'Resale' | 'Sub-Sale';

export type TenureType = 'Freehold' | '99-year Leasehold' | '999-year Leasehold' | '103-year Leasehold';

export interface TransactionRecord {
  id: string;
  project: string;
  street: string;
  postalDistrict: number; // 1 to 28
  districtCode: string; // e.g. "D09", "D15"
  postalSector: string;
  marketSegment: MarketSegment;
  propertyType: PropertyType;
  saleType: SaleType;
  nettPrice: number; // in SGD
  areaSqft: number;
  areaSqm: number;
  unitPricePsf: number;
  unitPricePsm: number;
  floorRange: string; // e.g. "#11-15", "#21-25"
  saleDate: string; // YYYY-MM-DD
  caveatDate: string; // YYYY-MM-DD
  tenure: TenureType;
  tenureDetails?: string; // e.g. "99 years from 2019"
  completionDate: string; // e.g. "2024 (TOP)", "1998"
  developer?: string;
  slaCaveatNumber: string; // e.g. "CV/2026/08942"
  numberOfUnits: number;
  imageUrl?: string;
}

export interface PostalDistrictInfo {
  district: number;
  code: string;
  region: MarketSegment;
  generalLocation: string;
  planningAreas: string[];
  medianPsf: number;
  totalTransactions30d: number;
}

export interface ProjectSummary {
  name: string;
  street: string;
  district: number;
  region: MarketSegment;
  propertyType: PropertyType;
  tenure: TenureType;
  topYear: string;
  totalUnits: number;
  developer: string;
  medianPsf: number;
  lowestPsf: number;
  highestPsf: number;
  transactionCount: number;
  imageUrl: string;
  description: string;
}

export interface PriceIndexTrend {
  period: string; // e.g. "2025-Q1"
  ccrIndex: number;
  rcrIndex: number;
  ocrIndex: number;
  overallIndex: number;
  volume: number;
}

export interface FilterState {
  searchMode: 'project' | 'district' | 'street';
  searchQuery: string;
  selectedDistricts: number[];
  propertyTypes: PropertyType[];
  saleTypes: SaleType[];
  tenures: TenureType[];
  marketSegments: MarketSegment[];
  dateRange: '3m' | '6m' | '1y' | '3y' | 'all';
  minPrice: number;
  maxPrice: number;
  minPsf: number;
  maxPsf: number;
  floorRanges: string[];
}
