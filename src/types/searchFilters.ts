import { Document } from "./document";

export interface SearchFilters {
  query: string;
  dateFrom: string;
  dateTo: string;
}

export interface SearchBarProps {
  onResults: (docs: Document[], filters: SearchFilters) => void;
}