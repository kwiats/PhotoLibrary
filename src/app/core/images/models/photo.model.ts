export interface Photo {
  id?: number;
  slug: string;
  created?: string;
  updated?: string;
  photo: string;
}

export interface Login {
  username: string;
  password: string;
}
