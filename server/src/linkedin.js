// Helpers for LinkedIn post links. Works with the URL formats LinkedIn gives you:
//   https://www.linkedin.com/posts/name_slug-activity-7512345678901234567-AbCd
//   https://www.linkedin.com/feed/update/urn:li:activity:7512345678901234567/
//   urn:li:share:7512345678901234567  (or ugcPost)
//   the <iframe src=".../embed/feed/update/urn:li:share:..."> embed code
const RE = /(activity|share|ugcPost)[:-](\d{18,20})/;

export function parsePost(input = '') {
  const m = String(input).match(RE);
  if (!m) return null;
  const [, type, id] = m;
  const urn = `urn:li:${type}:${id}`;
  return {
    urn,
    url: `https://www.linkedin.com/feed/update/${urn}/`,
    embed: `https://www.linkedin.com/embed/feed/update/${urn}`,
    // LinkedIn IDs carry their creation time in the top bits
    postedAt: new Date(Number(BigInt(id) >> 22n)),
  };
}
