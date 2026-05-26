export function splitToChars(text: string): string[] {
  return text.split('').map((char) => (char === ' ' ? ' ' : char))
}
