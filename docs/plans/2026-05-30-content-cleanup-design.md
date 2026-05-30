# Content Cleanup Design

## Goal

Clean up the current public-site content baseline before introducing persistent admin storage.

## Scope

This slice handles low-risk content and data hygiene only:

- Prevent placeholder social URLs from rendering as public links.
- Keep email as the durable contact fallback.
- Preserve Hotplate as the ordering source.
- Add tests around the social-link filtering behavior.

## Approach

Move social-link shaping into `lib/site.ts` so the footer and contact page share one source of truth. The helper will return configured social links and skip generic platform homepages such as `https://www.instagram.com/`, which are placeholders rather than business links.

The visible UI should continue to show email contact, and social icons should appear only when a specific profile URL is configured.

## Testing

Add focused unit tests for the site helper:

- Placeholder social profile URLs are omitted.
- A real social profile URL is retained.
- The email contact link is always available when an email is configured.

Run `npm run test`, `npm run typecheck`, and `npm run lint` before completion.
