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

type Init<C, A> = (current: C) => A;

function getUndefinedReducer<C, A>(
  init: Init<C, A>,
  reducer: Reducer<C, A>
) {
  return (acc, current) => {
    let result = acc;
    if (result === undefined) {
      result = init(current);
    }
    return reducer(result, current);
  };
}

// init = current => ({
//   ...current,
//   items: [],
//   count: 0,
// });
// 
// reducer = (acc, c) => ({
//   ...acc,
//   items: [ ...(acc.items), { item: c.item } ],
//   count: acc.count + 1,
// });

function grouping<C, B, A>(
  cascadingReducer: CascadingReducer<C, B>,
  keys: (keyof C)[],
  init: Init<B, A>,
  reducer: Reducer<B, A>
): CascadingReducer<C, A> {

  const init: Init<A> = () => undefined;
  const shouldDrop = getShouldDrop(keys);
  const groupingReducer = getUndefinedReducer(init, reducer);

  return build(cascadingReducer, init, shouldDrop, groupingReducer);
}

type Shut<C, A> = (values: Iterable<C>) => A;
function shut<C, B, A>(
  cascadingReducer: CascadingReducer<C, B>,
  init: Init<A>,
  reducer: Reducer<B, A>,
): Shut<C, A> {

  const shouldDrop: ShouldDrop<C> = (previous, current) => false;

  return values => iteraterReduce(
    build(cascadingReducer, init, shouldDrop, reducer);
    values,
  );
}

export type GroupingMethod<C, B, A> = (keys: (keyof C)[], getReducer: GetReducer<B, A>) => Grouping<C, B, A>;
export type ShutMethod<C, A> = (init: Init<A>, getReducer: GetReducer<C, A>) => A;
export type Grouping<C, B, A> = {
  grouping: GroupingMethod<C, B, A>,
  shut: ShutMethod<B, A>,
};

function createFrom<C, B, A>(cascadingReducer: CascadingReducer<C, B>): Grouping<C, B, A> {

  const groupingMethod: GroupingMethod<C, B, A> = (keys, getReducer) => createFrom(grouping(cascadingReducer, keys, getReducer));
  const shutMethod: ShutMethod<B, A> = (init, getReducer) => shut(cascadingReducer, init, getReducer);

  return {
    grouping: groupingMethod,
    shut: shutMethod,
  };
}

export function create<C, B, A>(): Grouping<C, B, A> {

  const shouldDrop: ShouldDrop<C> = (previous, current) => true;
  const init: Init<B> = () => undefined;
  const reducer: Reducer<C, B> = (acc, current) => current; // TODO ここにconsole.debugしこめる

  return createFrom(first(init, shouldDrop, reducer));
}
