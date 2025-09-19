export interface CategoryRule {
  id: string;
  name: string;
  regex: string;
  color: string;
  enabled: boolean;
}

export interface CategoryStats {
  name: string;
  count: number;
  totalBRL: number;
  color: string;
}
