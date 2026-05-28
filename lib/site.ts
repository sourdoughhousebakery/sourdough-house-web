export const siteConfig = {
  name: "Sourdough House Bakery",
  shortName: "Sourdough House",
  description:
    "Small-batch sourdough breads, cookies, muffins, and pastries made with slow fermentation and local pickup.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sourdough-house-bakery.vercel.app",
  hotplateChefId: process.env.HOTPLATE_CHEF_ID ?? "sourdoughhouse",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  tiktokUrl: "https://www.tiktok.com/",
  email: "hello@sourdoughhouse.com",
  pickupArea: "Local pickup"
};

export function getHotplateUrl() {
  return `https://hotplate.com/${siteConfig.hotplateChefId}`;
}

