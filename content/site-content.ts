import type { BakeCatalogItem } from "@/lib/catalog/types";
import type { FallbackMenuItem, ProcessStep, Testimonial } from "@/lib/hotplate/types";

export const navItems = [
  { href: "/menu", label: "Menu" },
  { href: "/story", label: "Story" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact" }
];

export const fallbackMenuItems: FallbackMenuItem[] = [
  {
    id: "country-sourdough",
    name: "Country Sourdough",
    price: "$10",
    description:
      "A slow-fermented everyday loaf with a crisp crust, open crumb, and balanced tang.",
    category: "Bread",
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=80",
    badge: "Best seller"
  },
  {
    id: "jalapeno-cheddar",
    name: "Jalapeno Cheddar",
    price: "$12",
    description:
      "A savory loaf with aged cheddar, roasted jalapeno warmth, and a golden blistered crust.",
    category: "Bread",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    badge: "Fan favorite"
  },
  {
    id: "sourdough-cookies",
    name: "Sourdough Cookies",
    price: "$18 / dozen",
    description:
      "Chewy bakery cookies with deep brown sugar flavor and a little sourdough magic.",
    category: "Sweets",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "morning-muffins",
    name: "Morning Muffins",
    price: "$16 / half dozen",
    description:
      "Tender muffins baked in small batches with seasonal fruit, spice, and sourdough depth.",
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cinnamon-rolls",
    name: "Cinnamon Rolls",
    price: "$24 / pan",
    description:
      "Soft sourdough rolls with cinnamon sugar swirls and a simple vanilla glaze.",
    category: "Specials",
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "custom-orders",
    name: "Custom Orders",
    price: "Request quote",
    description:
      "Seasonal boxes, party platters, cakes, and special bakes for gatherings.",
    category: "Custom",
    image:
      "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&q=80"
  }
];

export const bakeCatalogItems: BakeCatalogItem[] = [
  {
    id: "country-sourdough",
    name: "Country Sourdough",
    price: "$10",
    description:
      "A slow-fermented everyday loaf with a crisp crust, open crumb, and balanced tang.",
    category: "Bread",
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true,
    note: "Core bake"
  },
  {
    id: "jalapeno-cheddar",
    name: "Jalapeno Cheddar",
    price: "$12",
    description:
      "A savory loaf with aged cheddar, roasted jalapeno warmth, and a golden blistered crust.",
    category: "Bread",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true,
    note: "Fan favorite"
  },
  {
    id: "sourdough-cookies",
    name: "Sourdough Cookies",
    price: "$18 / dozen",
    description:
      "Chewy bakery cookies with deep brown sugar flavor and a little sourdough magic.",
    category: "Sweets",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true
  },
  {
    id: "morning-muffins",
    name: "Morning Muffins",
    price: "$16 / half dozen",
    description:
      "Tender muffins baked in small batches with seasonal fruit, spice, and sourdough depth.",
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: false,
    isTypicallyAvailable: false,
    showPrice: false,
    note: "Rotates with seasonal flavors"
  },
  {
    id: "cinnamon-rolls",
    name: "Cinnamon Rolls",
    price: "$24 / pan",
    description:
      "Soft sourdough rolls with cinnamon sugar swirls and a simple vanilla glaze.",
    category: "Specials",
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: false,
    isTypicallyAvailable: false,
    showPrice: true,
    note: "Weekend special"
  },
  {
    id: "custom-orders",
    name: "Custom Orders",
    price: "Request quote",
    description:
      "Seasonal boxes, party platters, cakes, and special bakes for gatherings.",
    category: "Custom",
    image:
      "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    isFeatured: false,
    isTypicallyAvailable: false,
    showPrice: false,
    note: "Ask before ordering"
  }
];

export const processSteps: ProcessStep[] = [
  {
    label: "Feed",
    title: "Starter first",
    description:
      "Every bake begins with a living starter that is fed, watched, and kept ready for flavor."
  },
  {
    label: "Rest",
    title: "Slow fermentation",
    description:
      "Long, cool ferments build the texture and tang that make each loaf worth waiting for."
  },
  {
    label: "Bake",
    title: "Small batches",
    description:
      "Orders are baked by hand in focused batches so the crust, crumb, and finish stay consistent."
  },
  {
    label: "Share",
    title: "Local pickup",
    description:
      "Fresh bakes are released through Hotplate drops and picked up close to home."
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The best bread I have ever had. You can taste the time and care in every slice.",
    name: "Sarah M.",
    source: "Happy customer"
  },
  {
    quote:
      "The cookies disappear before I can get them into the pantry. We order every drop.",
    name: "Local pickup customer",
    source: "Hotplate order"
  }
];

export const storyParagraphs = [
  "Sourdough House Bakery grew from a home starter into a small-batch bakery built around patience, good flour, and the kind of food people bring to the table before the bag is even fully open.",
  "The menu changes with the week: crusty loaves, soft sandwich bread, muffins, cookies, rolls, and seasonal specials. The process stays steady: feed the starter, let time do its work, bake with care, and keep pickup simple.",
  "Hotplate handles the live drops and ordering so customers can see what is fresh, reserve favorites, pay securely, and get notified when the next bake opens."
];
