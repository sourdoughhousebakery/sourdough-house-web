export const siteConfig = {
  name: "Sourdough House Bakery",
  shortName: "Sourdough House Bakery",
  description:
    "Small-batch sourdough breads, cookies, muffins, and pastries made with slow fermentation and local pickup.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sourdough-house-bakery.vercel.app",
  hotplateChefId: process.env.HOTPLATE_CHEF_ID?.trim() ?? "",
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

function normalizeSocialHref(platform: SocialLink["label"], value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^@/, "")}`;

  try {
    const url = new URL(withProtocol);
    url.protocol = "https:";
    url.hash = "";
    url.search = "";

    if (platform === "Instagram") {
      url.hostname = "www.instagram.com";
    }
    if (platform === "Facebook") {
      url.hostname = "www.facebook.com";
    }
    if (platform === "TikTok") {
      url.hostname = "www.tiktok.com";
      const handle = url.pathname.replace(/^\/+/, "").replace(/^@/, "").replace(/\/+$/, "");
      if (handle) url.pathname = `/@${handle}`;
    }

    const normalized = url.toString().replace(/\/$/, "");
    return isConfiguredUrl(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

export function getSocialLinks(config: ContactConfig = siteConfig): SocialLink[] {
  return [
    { href: normalizeSocialHref("Instagram", config.instagramUrl), label: "Instagram" as const },
    { href: normalizeSocialHref("Facebook", config.facebookUrl), label: "Facebook" as const },
    { href: normalizeSocialHref("TikTok", config.tiktokUrl), label: "TikTok" as const }
  ].filter((link): link is SocialLink => Boolean(link.href));
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
  if (!siteConfig.hotplateChefId) return "https://hotplate.com";
  return `https://hotplate.com/${siteConfig.hotplateChefId}`;
}
