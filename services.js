// =====================================================================
// SERVICES — the one place to manage what the site offers.
// The pricing section, the estimator, the emailed summary, and the
// "from $X" line in the hero are all generated from this file.
//
//   visible : false  -> hides the service everywhere (entry stays here,
//                       set it back to true to reopen it)
//   featured: true   -> shows a small "Featured" tag next to the service
//   order           -> the order of entries below is the display order;
//                       move an entry up or down to reorder it
//   price(s)        -> edit once; every label and total follows
//
// type 'base'  = priced per vehicle size, using `prices`
// type 'addon' = one flat `price`
// =====================================================================

const VEHICLES = [
  { id: 'sedan',    label: 'Sedan' },
  { id: 'smallsuv', label: '2 Row SUV / Crossover' },
  { id: 'large',    label: '3 Row SUV / Van / Truck' }
];

const SERVICES = [
  { id: 'full',      name: 'Full Detail',     type: 'base',
    prices: { sedan: 150, smallsuv: 200, large: 250 },
    visible: true, featured: false },

  { id: 'interior',  name: 'Interior Detail', type: 'base',
    prices: { sedan: 125, smallsuv: 150, large: 200 },
    visible: true, featured: false },

  { id: 'shampoo-sedan', name: 'Seat Shampooing',       type: 'addon', price: 50,
    visible: true, featured: false },
  { id: 'headlight',     name: 'Headlight Restoration', type: 'addon', price: 75,
    visible: true, featured: false },
  { id: 'engine',        name: 'Engine Bay Cleaning',   type: 'addon', price: 50,
    visible: true, featured: false },
  { id: 'plastics',      name: 'Plastic Trim Shine',    type: 'addon', price: 25,
    visible: true, featured: false }
];
