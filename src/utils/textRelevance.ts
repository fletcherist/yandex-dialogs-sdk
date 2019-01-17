import levenshtein from 'fast-levenshtein';
import { LEVENSHTEIN_MATCH_THRESHOLD } from './constants';

export type ITextRelevanceProvider = (
  a: string,
  b: string,
) => number;

/**
 * Calculating Levenshtein distance between 2 strings
 * More info: https://en.wikipedia.org/wiki/Levenshtein_distance
 */
export function getLevenshteinRelevance(a: string, b: string): number {
  if (!a || a.length === 0 || !b || b.length === 0) {
    return a ? a.length :
           b ? b.length :
           0;
  }
  const maxLength = Math.max(a.length, b.length);
  const levenshteinValue = levenshtein.get(a, b);
  const levenshteinRelevance = 1 - levenshteinValue / maxLength;
  return levenshteinRelevance < LEVENSHTEIN_MATCH_THRESHOLD ?
      0 : Math.max(0, Math.min(levenshteinRelevance, 1));
}
