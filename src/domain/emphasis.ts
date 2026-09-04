export type Segment = { text: string; emphasis: boolean };

/**
 * Splits "AI systems, *deployed* where" into plain and emphasised segments.
 * The schema already rejects unbalanced markers; this throws too so the
 * function is safe to call on any string.
 */
export function parseEmphasis(input: string): Segment[] {
  const parts = input.split("*");
  if (parts.length % 2 === 0)
    throw new SyntaxError("Unbalanced * emphasis markers");
  return parts
    .map((text, index) => ({ text, emphasis: index % 2 === 1 }))
    .filter((segment) => segment.text.length > 0);
}
