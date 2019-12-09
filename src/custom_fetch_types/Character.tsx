// interface for fetched data
// single element

export interface Character {
    id: number;
    name: string;
    status: string;
    type: string;
    gender: string;
    origin: object;
    location: object;
    episode: string[];
    url: string;
    created: string;
  }