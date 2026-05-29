export type BakeCatalogItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: string;
  isActive: boolean;
  isFeatured: boolean;
  isTypicallyAvailable: boolean;
  showPrice: boolean;
  note?: string;
};

export type PublicCatalogItem = BakeCatalogItem & {
  displayPrice: string | null;
  availabilityLabel: string;
};

