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

export type SiteConfig = typeof siteConfig;

export type ContactConfig = Pick<SiteConfig, "email" | "instagramUrl" | "facebookUrl" | "tiktokUrl">;

export type SocialLink = {
  label: "Instagram" | "Facebook" | "TikTok";
  href: string;
};

export type ContactLink =
  | (SocialLink & { kind: "social" })
  | {
      label: string;
      href: string;
      kind: "email";
    };

const placeholderSocialUrls = new Set([
  "https://instagram.com",
  "https://www.instagram.com",
  "https://facebook.com",
  "https://www.facebook.com",
  "https://tiktok.com",
  "https://www.tiktok.com"
]);

function isConfiguredUrl(href: string) {
  const trimmed = href.trim();
  if (!trimmed) return false;

  const normalized = trimmed.replace(/\/+$/, "");
  return !placeholderSocialUrls.has(normalized);
}

export function getSocialLinks(config: ContactConfig = siteConfig): SocialLink[] {
  return [
    { href: config.instagramUrl, label: "Instagram" as const },
    { href: config.facebookUrl, label: "Facebook" as const },
    { href: config.tiktokUrl, label: "TikTok" as const }
  ].filter((link) => isConfiguredUrl(link.href));
}

export function getContactLinks(config: ContactConfig = siteConfig): ContactLink[] {
  const links: ContactLink[] = getSocialLinks(config).map((link) => ({
    ...link,
    kind: "social" as const
  }));

  if (config.email.trim()) {
    links.push({
      label: config.email,
      href: `mailto:${config.email}`,
      kind: "email"
    });
  }

  return links;
}

export function getHotplateUrl() {
  return `https://hotplate.com/${siteConfig.hotplateChefId}`;
}
