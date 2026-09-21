/* Small helpers shared across components.
   You normally do NOT need to edit this file — pricing/promo lives in config.js. */

// Format a number as Naira, e.g. 40560 -> "₦40,560.00"
export function naira(amount) {
  return '₦' + Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/*
 * Work out the promo result for a mode, given the current quantities.
 *
 * quantities: { [productId]: number }
 * mode: one entry from MODES (config.js)
 *
 * Returns:
 *   { eligible, freeUnits, reason }
 *     eligible  – true if the customer qualifies for free units
 *     freeUnits – how many free units they get (0 if not eligible)
 *     reason    – short internal note (handy for debugging)
 */
export function computePromo(mode, quantities) {
  const promo = mode.promo;
  if (!promo || !promo.enabled) {
    return { eligible: false, freeUnits: 0, reason: 'promo disabled for this mode' };
  }

  const activeProducts = mode.products.filter((p) => p.active);
  const totalUnits = activeProducts.reduce(
    (sum, p) => sum + (Number(quantities[p.id]) || 0),
    0
  );

  // Rule: order must span EVERY active product (each one >= 1).
  if (promo.requireAllProducts) {
    const spansAll = activeProducts.every((p) => (Number(quantities[p.id]) || 0) >= 1);
    if (!spansAll) {
      return { eligible: false, freeUnits: 0, reason: 'must order across all products' };
    }
  }

  if (totalUnits < promo.perUnits) {
    return { eligible: false, freeUnits: 0, reason: 'below promo threshold' };
  }

  const freeUnits = Math.floor(totalUnits / promo.perUnits) * promo.freePerBlock;
  return { eligible: freeUnits > 0, freeUnits, reason: 'ok' };
}
