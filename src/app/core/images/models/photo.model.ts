export interface Photo {
  id?: number;
  slug: string;
  created?: string;
  updated?: string;
  photo: string;
  column: number;
  order: number;
}

export interface Login {
  username: string;
  password: string;
}
