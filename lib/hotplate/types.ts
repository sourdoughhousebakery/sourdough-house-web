export type HotplateMenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string | null;
  sold: number;
  available: number | null;
  isAvailable: boolean;
  category: string;
  source: "hotplate";
};

export type FallbackMenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  badge?: string;
};

export type MenuResult = {
  items: HotplateMenuItem[];
  event: HotplateEvent | null;
  source: "live" | "past" | "fallback";
  error?: string;
};

export type HotplateEvent = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  status: string;
  goLiveTime: string | null;
  isPickupEnabled: boolean;
  isDeliveryEnabled: boolean;
};

export type HotplateReview = {
  quote: string;
  rating: number;
  name: string;
};

export type HotplateProfile = {
  restaurantName: string;
  about: string;
  bannerImage: string | null;
  logoImage: string | null;
};

export type ProcessStep = {
  label: string;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  source: string;
};

