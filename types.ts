
export interface Location {
  lat: number;
  lng: number;
}

export enum SpringStatus {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  THREATENED = 'Threatened'
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface Spring {
  id: string;
  name: string;
  description: string;
  location: Location;
  status: SpringStatus;
  imageUrl?: string;
  contributor: string;
  createdAt: string;
  flowRate?: string; // e.g., "50 L/s"
  comments: Comment[];
  recommendations?: string[];
  kecamatan?: string;
  desa?: string;
}

export interface DashboardStats {
  totalSprings: number;
  healthyCount: number;
  criticalCount: number;
  recentSubmissions: number;
}
