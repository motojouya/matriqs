
// TODO join を作る
// こんな感じかなー
//
// - base<P>: (resource: Iterable<P>) => Joiner<P>
// - innerJoin<L, R, G>: (joiner: Joiner<L>, resource: Iterable<R>, on: (left: L, right: R) => boolean) => Joiner<G>
// - leftJoin<L, R, G>: (joiner: Joiner<L>, resource: Iterable<R>, on: (left: L, right: R) => boolean) => Joiner<G>
// - execute<G>: (joiner: Joiner<G>) => Iterable<G>
//
// executeの戻り値はgeneraterにしようかな

const orders = [ 1, 2, 3 ];
const orderItems = [
  { order: 1, item: 1, },
  { order: 1, item: 2, },
  { order: 3, item: 1, },
];
const orderItemLot = [
  { order: 1, item: 1, lot: 1, },
  { order: 1, item: 1, lot: 2, },
  { order: 1, item: 2, lot: 1, },
  { order: 3, item: 1, lot: 1, },
];


function getRight(resources) {
  const stock = resources;
  const next = () => stock.pop(); // popはstockの内部状態も変化する
  return {
    next
  };
}

function executer(right, resources) {

  const stack = resources;
  const emitted = false;
  const before = stack.pop();

  const next = () => {
    const rightValue = right.next();
    if (before[key] === rightValue[key]) {
      return {
        ...before,
        ...rightValue,
      };
    } else if (!emitted) {
      const result = {
        ...before,
      };
      before = stack.pop();
      return result;
    } else {
      before = stack.pop();
    }
  };

  return {
    next,
  };
}

function execute(joinStack) {
  const joiner = joinStack.toReversed().reduce((acc, current) => {
    return acc(current);
  }, right());

  return joiner();
}

function getJoiner(stack) {
  const join = next => getJoiner([ ...stack, next ]);
  const execute;
  return {
    join,
    execute,
  }
}

export function create(resource: Iterator) {
  return getJoiner([resource]);
}
