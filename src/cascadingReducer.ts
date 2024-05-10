
// TODO reducerはindex を引数に取りたい
// inner index, outer indexとかあるかも。レイヤ事にある？わからん

export type Init<A> = () => A;
export type ShouldDrop<C> = (previous?: C, current: C) => boolean;
export type Reducer<C, A> = (accumlater: A, current: C) => A;
export type Reduce<C> = (current: C) => void;
export type Drop<A> = () => A;
export type CascadingReducer<C, A> = {
  reduce: Reduce<C>;
  drop: Drop<A>;
  shouldDrop: ShouldDrop<C>;
};

export function first<C, A>(
  init: Init<A>,
  shouldDrop: ShouldDrop<C>,
  reducer: Reducer<C, A>
): CascadingReducer<C, A> {

  let previous: P? = undefined;
  let accumlater: R = init();

  const reduce: Reduce<P> = current => {
    accumlater = reducer(accumlater, current);
    previous = current;
  };

  const drop: Drop<R> = () => {
    const result = accumlater;
    accumlater = init();
    return result;
  };

  return {
    reduce,
    drop,
    shouldDrop,
  };
}

export function build<C, U, A>(
  upperStep: CascadingReducer<C, U>,
  init: Init<A>,
  shouldDrop: ShouldDrop<C>,
  reducer: Reducer<U, A>
): CascadingReducer<C, A> {

  let previous: P? = undefined;
  let accumlater: R = init();

  const reduce: Reduce<P> = current => {
    if (upperStep.shouldDrop(previous, current)) {
      accumlater = reducer(accumlater, upperStep.drop());
    }
    upperStep.reduce(current);
    previous = current;
  };

  const drop: Drop<R> = () => {
    const result = reducer(accumlater, upperStep.drop());
    accumlater = init();
    return result;
  };

  return {
    reduce,
    drop,
    shouldDrop,
  };
}

export function iteraterReduce<C, A>(
  cascadingReducer: CascadingReducer<C, A>,
  values: Iterable<C>
): A {
  for (const current of values) {
    cascadingReducer.reduce(current);
  }
  return cascadingReducer.drop();
}
