
const shipment = [
  { shipment: 1, item: 1, quantity: 2 },
  { shipment: 1, item: 2, quantity: 1 },
  { shipment: 2, item: 1, quantity: 2 },
  { shipment: 3, item: 2, quantity: 1 },
  { shipment: 3, item: 3, quantity: 1 },
];

const shipment = [
  { shipment: 1, item: 1, lot: 1, quantity: 2 },
  { shipment: 1, item: 1, lot: 2, quantity: 1 },
  { shipment: 1, item: 2, lot: 1, quantity: 1 },
  { shipment: 2, item: 1, lot: 1, quantity: 1 },
  { shipment: 2, item: 2, lot: 1, quantity: 1 },
];

// 1
const rest = [
  { shipment: 1, item: 1, lot: 2, quantity: 1 },
  { shipment: 1, item: 2, lot: 1, quantity: 1 },
  { shipment: 2, item: 1, lot: 1, quantity: 1 },
  { shipment: 2, item: 2, lot: 1, quantity: 1 },
];
const layered = [
  0: { shipment: 1, item: 1, lots: [1], quantity: 1 },
];

// 2
const rest = [
  { shipment: 1, item: 2, lot: 1, quantity: 1 },
  { shipment: 2, item: 1, lot: 1, quantity: 1 },
  { shipment: 2, item: 2, lot: 1, quantity: 1 },
];
const layered = [
  0: { shipment: 1, item: 1, lots: [1,2], quantity: 1 }, // layerがすべて一致しているので次にreduceしない
];

// 3
const rest = [
  { shipment: 2, item: 1, lot: 1, quantity: 1 },
  { shipment: 2, item: 2, lot: 1, quantity: 1 },
];
const layered = [
  0: { shipment: 1, item: 2, lots: [1], quantity: 1 },
  1: { shipment: 1, items: [{ item: 1, lots: [1,2]}], quantity: 1 } // itemのみ違うので、reduceをitemのaccまでで止める
];

// 4
const rest = [
  { shipment: 2, item: 2, lot: 1, quantity: 1 },
];
const layered = [
  0: { shipment: 2, item: 1, lots: [1], quantity: 1 },
  1: undefined,
  2: [
    { shipment: 1, items: [{ item: 1, lots: [1,2]},{ item: 2, lots: [1]}], quantity: 1 }, // すべて違うので、最後までreduce
  ],
];

// 5
const rest = [
];
const layered = [
  0: { shipment: 2, item: 2, lots: [1], quantity: 1 },
  1: { shipment: 2, items: [{ item: 1, lots: [1]}], quantity: 1 }, //shipmentは一致しているのでsecond layerでreduceをとめる
  2: [
    { shipment: 1, items: [{ item: 1, lots: [1,2]},{ item: 2, lots: [1]}], quantity: 1 },
  ],
];

// getFinalResult
const layered = [
  0: undefined,
  1: undefined,
  2: [
    { shipment: 1, items: [{ item: 1, lots: [1,2]},{ item: 2, lots: [1]}], quantity: 1 },
    { shipment: 2, items: [{ item: 1, lots: [1]},{ item: 2, lots: [1]}], quantity: 1 }, // 最後はfirstから最後までreduceしていく
  ],
];


function reduce(acc, value) {
  const {
    shipment,
    item,
    quantity,
  } = value;
  if (acc) {
    acc.items.push({
      item,
      quantity,
    });
    return acc;
  } else {
    return {
      shipment,
      items: [
        item,
        quantity
      ],
    };
  }
}




