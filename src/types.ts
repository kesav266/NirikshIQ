export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface LocationSite {
  id: string;
  code: string;
  name: string;
  state: string;
  changeType: string;
  confidence: number; // e.g. 92 for 92%
  priority: PriorityLevel;
  date: string;
  lat: number;
  lng: number;
  xPercent: number; // for SVG grid placement
  yPercent: number;
  changedArea: string;
  firstObservation: string;
  sensor: string;
  processingStatus: string;
  verificationStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  verificationTimestamp?: string;
}

export interface ReviewItem {
  id: string;
  siteId: string;
  code: string;
  location: string;
  changeType: string;
  confidence: number;
  priority: PriorityLevel;
  status: 'Pending' | 'Verified' | 'Rejected';
  date: string;
}

export interface SimilarSite {
  id: string;
  name: string;
  similarity: number;
  changePattern: string;
  coordinates: string;
  area: string;
}

export interface TemporalStep {
  month: string;
  year: string;
  status: 'Stable' | 'Emerging' | 'Confirmed';
  confidence: number;
  description: string;
}
