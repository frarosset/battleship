// This function makes the modulo works for negative number
// see https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
export function mod(x, n) {
  return ((x % n) + n) % n;
}
