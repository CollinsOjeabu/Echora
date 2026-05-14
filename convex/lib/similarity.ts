/**
 * Pure utility functions for vector similarity and ID ordering.
 * No Convex imports — pure functions for testability.
 */

/**
 * Compute cosine similarity between two vectors.
 * Returns a value in [-1, 1]. Returns 0 if either vector has zero magnitude.
 * Validates that both vectors have equal length.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector length mismatch: a has ${a.length} dimensions, b has ${b.length}`
    )
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)

  // Guard against division by zero (zero-magnitude vectors)
  if (magnitude === 0) return 0

  // Clamp to [-1, 1] to handle floating-point imprecision
  const similarity = dotProduct / magnitude
  return Math.max(-1, Math.min(1, similarity))
}

/**
 * Normalize a pair of IDs into canonical order for idempotent edge storage.
 * sourceA is always the lexicographically smaller ID.
 * This ensures (A,B) and (B,A) produce the same row in the graphEdges table.
 */
export function normalizeOrderedPair(
  idA: string,
  idB: string
): { sourceA: string; sourceB: string } {
  if (idA <= idB) {
    return { sourceA: idA, sourceB: idB }
  }
  return { sourceA: idB, sourceB: idA }
}
