import type {
  Init,
  ShouldDrop,
  Reducer,
  Reduce
  Drop,
  CascadingReducer,
} from "./cascadingReducer.js";
import {
  first,
  build,
  iteraterReduce,
} from './cascadingReducer.js';

// TODO
type GetReducer<C, A> = () => Reducer<C, A>;

function getShouldDrop<C>(keys: (keyof C)[]): ShouldDrop<C> {
  return (before, parameter) => keys.reduce((acc, key) => (acc ? true : before[key] !== parameter[key]), false);
}

function grouping<C, U, A>(
  cascadingReducer: CascadingReducer<C, U>,
  keys: (keyof C)[],
  getReducer: GetReducer<U, A>
): CascadingReducer<C, A> {

  const init: Init<R> = () => undefined;
  const shouldDrop = getShouldReset(keys);
  const reducer = getReducer(); // TODO 引数?

  return build(cascadingReducer, init, shouldDrop, reducer);
}

// TODO endとかfinishとか最後的な意味の名前に変えたい
type Stream<C, A> = (values: Iterable<C>) => A;
function stream<C, U, A>(
  cascadingReducer: CascadingReducer<C, U>,
  init: Init<A>,
  getReducer: GetReducer<U, A>,
): Stream<C, A> {

  const shouldDrop: ShouldDrop<P> = (previous, current) => false;
  const reducer = getReducer(); // TODO 引数?

  return values => iteraterReduce(
    build(cascadingReducer, init, shouldDrop, reducer);
    values,
  );
}

export type GroupingMethod<C, U, A> = (keys: (keyof C)[], getReducer: GetReducer<U, A>) => Grouping<C, U, A>;
export type StreamMethod<C, A> = (init: Init<A>, getReducer: GetReducer<C, A>) => A;
export type Grouping<C, U, A> = {
  grouping: GroupingMethod<C, U, A>,
  stream: StreamMethod<U, A>,
};

function createFrom<C, U, A>(cascadingReducer: CascadingReducer<C, U>): Grouping<C, U, A> {

  const groupingMethod: GroupingMethod<C, U, A> = (keys, getReducer) => createFrom(grouping(cascadingReducer, keys, getReducer));
  const streamMethod: StreamMethod<U, A> = (init, getReducer) => stream(cascadingReducer, init, getReducer);

  return {
    grouping: groupingMethod,
    stream: streamMethod,
  };
}

export function create<C, U, A>(): Grouping<C, U, A> {

  const shouldDrop: ShouldDrop<C> = (previous, current) => true;
  const init: Init<U> = () => undefined;
  const reducer: Reducer<C, U> = (acc, current) => current; // TODO ここにconsole.debugしこめる

  return createFrom(first(init, shouldReset, reducer));
}
