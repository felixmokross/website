export function slugify(s: string) {
  s = s.replace(/^\s+|\s+$/g, "");
  s = s.toLowerCase();
  s = s
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return s;
}
