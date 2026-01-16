
export interface BankRateInfo {
  rate: number; // Value for sorting
  display: string; // Text for display
  quota: string; // Display text for quota
  numericQuota: number; // Numeric value for calculation (use Infinity for unlimited)
  transfers: string;
  notes: string;
}

export interface BankData {
  id: string;
  name: string;
  code: string;
  newCustomer: BankRateInfo;
  oldCustomer: BankRateInfo;
}

export type ViewType = 'combined' | 'newOnly' | 'oldOnly';
