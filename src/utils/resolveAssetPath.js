export function resolveAssetPath(relativePath) {
  const base = import.meta.env.BASE_URL;
  const cleanPath = relativePath.replace(/^\/+/, ''); // remove leading slashes
  return `${base.replace(/\/?$/, '/')}${cleanPath}`; // ensure exactly one slash between
}
