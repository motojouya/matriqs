
// TODO reducerはindex を引数に取りたい
// inner index, outer indexとかあるかも。レイヤ事にある？わからん

export type Init<R> = () => R;
export type ShouldReset<P> = (before: P, parameter: P) => boolean;
export type Reducer<P, R> = (parameter: P, accumlater: R) => R;
export type Reduce<P> = (parameter: P) => void;
export type Finish<R> = () => R;
export type LayeredReducer<P, R> = {
  reduce: Reduce<P>;
  finish: Finish<R>;
  shouldReset: ShouldReset<P>;
};

export function first<P, R>(
  init: Init<R>,
  shouldReset: ShouldReset<P>,
  reducer: Reducer<P, R>
): LayeredReducer<P, R> {

  let before: P? = undefined;
  let accumlater: R = init();

  const reduce: Reduce<P> = parameter => {
    prior.reduce(parameter);
    before = parameter;
  };

  const finish: Finish<R> = () => {
    const result = accumlater;
    accumlater = init();
    return result;
  };

  return {
    reduce,
    finish,
    shouldReset,
  };
}

export function build<P, M, R>(
  prior: LayeredReducer<P, M>,
  init: Init<R>,
  shouldReset: ShouldReset<P>,
  reducer: Reducer<M, R>
): LayeredReducer<P, R> {

  let before: P? = undefined;
  let accumlater: R = init();

  const reduce: Reduce<P> = parameter => {
    if (prior.shouldReset(before, parameter)) {
      const priorResult = prior.finish();
      accumlater = reducer(accumlater, priorResult);
    }
    prior.reduce(parameter);
    before = parameter;
  };

  const finish: Finish<R> = () => {
    const priorResult = prior.finish();
    const result = reducer(accumlater, priorResult);

    accumlater = init();
    return result;
  };

  return {
    reduce,
    finish,
    shouldReset,
  };
}

export function iteraterReduce<P, R>(
  parameters: Iterable<P>,
  layeredReducer: LayeredReducer<P, R>
): R {
  for (const parameter of parameters) {
    layeredReducer.reduce(parameter);
  }
  return layeredReducer.finish();
}
