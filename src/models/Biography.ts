export interface Biography {
  id: string;
  name: string;
  profession: string;
  birthDate: string;
  deathDate?: string;
  imageUrl?: string;
  summary: string;
  achievements: string[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
  isFavorite?: boolean;
  category?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  event: string;
}

export interface CreateBiographyDTO {
  name: string;
  profession: string;
  birthDate: string;
  deathDate?: string;
  imageUrl?: string;
  summary: string;
  achievements: string[];
  timeline: TimelineEvent[];
  category?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  sortBy: 'name' | 'date' | 'recent';
  showUserCreatedFirst: boolean;
}

export interface BiographyStats {
  total: number;
  userCreated: number;
  favorites: number;
  byCategory: Record<string, number>;
  byCentury: Record<string, number>;
}