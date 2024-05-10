type Reducer<A, C> = (accumlater: A, current: C) => A;
type Mapper<T, S> = (value: T) => S;
type Predicater<T> = (value: T) => boolean;

type Transducer<C, B, A> = (reducer: Reducer<B, A>) => Reducer<C, A>;

function mapping<C, B, A>(map: Map<C, B>): Transducer<C, B, A> {
  return function (reducer: Reducer<A, B>) {
    return function (accumlater: A, current: C) {
      if (predicate(current)) {
        return reducer(acc, current);
      } else {
        return acc;
      }
    };
  };
}

function filtering<C, A>(predicate: Predicate<C>): Transducer<C, C, A> {
  return function (reducer: Reducer<A, C>) {
    return function (accumlater: A, current: C) {
      if (predicate(current)) {
        return reducer(acc, current);
      } else {
        return acc;
      }
    };
  };
}

function getReducer(transducers, reducer: Reducer) {
  return transducers.toReversed().reduce((re, trans) => trans(re), reducer);
}

// TODO これだと、reduceの初期値を認識できない。型として、reducerと合わせる必要があるので、最後に適用するreducerといっしょに引数にしてもいいかも
type TransducerStack = {
  map,
  filter,
  reduce,
};

function getTransducerStack(transducerStack: Array): TransducerStack {

  const map = mapper => {
    transducerStack.push(mapping(mapper));
    return getTransducerStack(transducerStack);
  };

  const filter = predicate => {
    transducerStack.push(filtering(predicate));
    return getTransducerStack(transducerStack);
  };

  const reduce = (reducer) => getReducer(transducerStack, reducer);

  return {
    map,
    filter,
    reduce,
  };
}

export function create() {
  return getTransducerStack([]);
}
