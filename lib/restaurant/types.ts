export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isAiFavorite?: boolean;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  delivery: string;
  brandGradient: string;
  menu: {
    category: string;
    items: Dish[];
  }[];
}
