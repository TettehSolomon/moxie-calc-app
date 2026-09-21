/* ============================================================================
 *  MOXIE ORDER CALCULATOR — CENTRAL CONFIG
 *  ---------------------------------------------------------------------------
 *  👉 THIS IS THE ONLY FILE YOU NEED TO TOUCH FOR NORMAL CHANGES.
 *
 *  What you can safely edit here:
 *    • Product prices ............... MODES.<mode>.products[].price
 *    • Product names ................ MODES.<mode>.products[].name
 *    • Turn a product on/off ........ MODES.<mode>.products[].active
 *    • Packaging label .............. MODES.<mode>.packaging
 *    • Promo rule (free cartons) .... MODES.<mode>.promo
 *    • Procurement channels ......... CHECKOUT_CHANNELS
 *    • Brand colours ................ see src/index.css (@theme block)
 *
 *  You should NOT need to touch any other file for day-to-day tweaks.
 * ==========================================================================*/


/* ---------------------------------------------------------------------------
 *  CHECKOUT CHANNELS
 *  The "Procurement Channel" dropdown in the checkout popup.
 *  Add / remove options here. "Others" reveals a free-text box automatically.
 * -------------------------------------------------------------------------*/
export const CHECKOUT_CHANNELS = ['NHP', 'Rockforth', 'Mr Gbenga', 'Others'];


/* ---------------------------------------------------------------------------
 *  MODES — Wholesale and Retail.
 *  Each mode is just a self-contained set of data. They share the same UI.
 *
 *  promo:
 *    enabled ............. true = this mode can give free units
 *    perUnits ............ how many units earn a free one (20 = every 20)
 *    freePerBlock ........ free units granted per block (1 = 1 free per 20)
 *    requireAllProducts .. true = customer MUST order at least 1 of EVERY
 *                          active product, otherwise NO promo (the
 *                          "must cut across all products" rule).
 *
 *  Free-unit maths (when eligible): floor(totalUnits / perUnits) * freePerBlock
 *    → 20 = 1 free, 40 = 2 free, 60 = 3 free ... (uncapped).
 * -------------------------------------------------------------------------*/
export const MODES = {

  /* ======================= WHOLESALE (default tab) ======================= */
  wholesale: {
    label: 'Wholesale',
    packaging: 'Carton by 24 bottles', // shown in the "Packaging" column
    unit: 'carton',                    // singular word used in messages
    unitPlural: 'cartons',             // plural word used in messages

    promo: {
      enabled: true,
      perUnits: 20,
      freePerBlock: 1,
      requireAllProducts: true,
    },

    // --- PRICES: edit the numbers below (no commas, no ₦) ---
    products: [
      { id: 1, name: 'MOXIE PARACETAMOL SUSPENSION', price: 40560, active: true },
      { id: 2, name: 'MOXIE VITAMIN C SYRUP',        price: 38160, active: true },
      { id: 3, name: 'MOXIE LORATADINE SYRUP',       price: 48000, active: true },
      { id: 4, name: 'MOXIE CHLORPHENIRAMINE SYRUP', price: 36240, active: true },
      // active:false = shown but greyed out / not orderable (no price yet)
      { id: 5, name: 'MOXIE CHESTY COUGH MIXTURE',   price: 0,     active: false },
      { id: 6, name: 'MOXIE SALINE NASAL SPRAY',     price: 0,     active: false },
    ],
  },

  /* ============================== RETAIL ================================= */
  /* Retail is a plain price calculator — NO free-unit promo (per brief). */
  retail: {
    label: 'Retail',
    packaging: 'Bottles',
    unit: 'bottle',
    unitPlural: 'bottles',

    promo: {
      enabled: false, // set to true + fill the fields above to enable later
      perUnits: 20,
      freePerBlock: 1,
      requireAllProducts: true,
    },

    // --- PRICES: edit the numbers below (no commas, no ₦) ---
    products: [
      { id: 1, name: 'MOXIE PARACETAMOL SUSPENSION', price: 1760, active: true },
      { id: 2, name: 'MOXIE VITAMIN C SYRUP',        price: 1650, active: true },
      { id: 3, name: 'MOXIE LORATADINE SYRUP',       price: 2100, active: true },
      { id: 4, name: 'MOXIE CHLORPHENIRAMINE SYRUP', price: 1585, active: true },
      { id: 5, name: 'MOXIE CHESTY COUGH MIXTURE',   price: 0,    active: false },
      { id: 6, name: 'MOXIE SALINE NASAL SPRAY',     price: 0,    active: false },
    ],
  },
};

// Which tab opens first. Change to 'retail' to make retail the default.
export const DEFAULT_MODE = 'wholesale';
