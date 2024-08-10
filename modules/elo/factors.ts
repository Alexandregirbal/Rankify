import { BASE_K_FACTOR } from "./constants";

/**
 * Commence à 2K, converge vers K.
 * Changer 10 pour faire baisser K plus ou moins vite.
 * https://www.desmos.com/calculator ->
 * 20\ \cdot\ \left(1+\frac{1}{1+\frac{x}{10}}\right)
 */
export const calculateKFactor = (games: number): number => {
  const result = BASE_K_FACTOR * (1 + 1 / (1 + games / 10));
  return Number(result.toFixed(2));
};

/**
 * J'ai choisi arbitrairement cette fonction pour calculer le "Point Factor".
 * Plus le delta des scores est grand, plus le PFact est grand.
 * On aurait pu intégrer ça directement dans la formule de calcul de la note,
 * mais j'ai préféré le faire séparément par soucis de simplicité.
 */
export const calculatePFactor = (
  score1: number,
  score2: number,
  minDelta: number = 1
): number => {
  const min = Math.min(score1, score2);
  const max = Math.max(score1, score2);
  const result = max / (min + minDelta);
  return Number(result.toFixed(2));
};