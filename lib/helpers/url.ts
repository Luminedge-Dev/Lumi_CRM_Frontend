/**
 * Returns the URL only if it is an absolute http(s) link, otherwise undefined. Use for any
 * href whose value comes from stored data: React 18 still executes `javascript:` hrefs.
 */
export function safeHttpUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}
