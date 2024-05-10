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
  return (previous, current) => keys.reduce((acc, key) => (acc ? true : previous[key] !== current[key]), false);
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

type Shut<C, A> = (values: Iterable<C>) => A;
function shut<C, U, A>(
  cascadingReducer: CascadingReducer<C, U>,
  init: Init<A>,
  getReducer: GetReducer<U, A>,
): Shut<C, A> {

  const shouldDrop: ShouldDrop<P> = (previous, current) => false;
  const reducer = getReducer(); // TODO 引数?

  return values => iteraterReduce(
    build(cascadingReducer, init, shouldDrop, reducer);
    values,
  );
}

export type GroupingMethod<C, U, A> = (keys: (keyof C)[], getReducer: GetReducer<U, A>) => Grouping<C, U, A>;
export type ShutMethod<C, A> = (init: Init<A>, getReducer: GetReducer<C, A>) => A;
export type Grouping<C, U, A> = {
  grouping: GroupingMethod<C, U, A>,
  shut: ShutMethod<U, A>,
};

function createFrom<C, U, A>(cascadingReducer: CascadingReducer<C, U>): Grouping<C, U, A> {

  const groupingMethod: GroupingMethod<C, U, A> = (keys, getReducer) => createFrom(grouping(cascadingReducer, keys, getReducer));
  const shutMethod: ShutMethod<U, A> = (init, getReducer) => close(cascadingReducer, init, getReducer);

  return {
    grouping: groupingMethod,
    shut: shutMethod,
  };
}

export function create<C, U, A>(): Grouping<C, U, A> {

  const shouldDrop: ShouldDrop<C> = (previous, current) => true;
  const init: Init<U> = () => undefined;
  const reducer: Reducer<C, U> = (acc, current) => current; // TODO ここにconsole.debugしこめる

  return createFrom(first(init, shouldReset, reducer));
}
