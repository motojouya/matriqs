import type {
  Init,
  ShouldReset,
  Reducer,
  Reduce
  Finish,
  LayeredReducer,
} from "./layeredReducer.js";
import {
  first,
  build,
  iteraterReduce,
} from './layeredReducer.js';

// TODO
type GetReducer<P, R> = () => Reducer<P, R>;

function getShouldReset<P>(keys: (keyof P)[]): ShouldReset<P> {
  return (before, parameter) => keys.reduce((acc, key) => (acc ? true : before[key] !== parameter[key]), false);
}

function grouping<P, M, R>(
  layerdReducer: LayeredReducer<P, M>,
  keys: (keyof P)[],
  getReducer: GetReducer<M, R>
): LayeredReducer<P, R> {

  const init: Init<R> = () => undefined;
  const shouldReset = getShouldReset(keys);
  const reducer = getReducer(); // TODO 引数?

  return build(layerdReducer, init, shouldReset, reducer);
}

type List<P, R> = (parameters: Iterable<P>) => R
function list<P, M>(
  layerdReducer: LayeredReducer<P, M>,
  getReducer: GetReducer<M, M[]>,
): List<P, M[]> {

  const init: Init<M[]> = () => [];
  const shouldReset: ShouldReset<P> = (before, parameter) => false;
  const reducer = getReducer(); // TODO 引数?

  return parameters => iteraterReduce(
    parameters,
    build(layerdReducer, init, shouldReset, reducer);
  );
}

type Stream<P, R> = (parameters: Iterable<P>) => R
function stream<P, M, R>(
  layerdReducer: LayeredReducer<P, M>,
  init: Init<R>,
  getReducer: GetReducer<M, R>,
): Stream<P, R> {
  const reducer = getReducer(); // TODO 引数?
  const shouldReset: ShouldReset<P> = (before, parameter) => false;

  return parameters => iteraterReduce(
    parameters,
    build(layerdReducer, init, shouldReset, reducer);
  );
}

export type GroupingMethod<P, M, R> = (keys: (keyof P)[], getReducer: GetReducer<P, M>) => Grouping<P, M, R>;
export type ListMethod<M> = (getReducer: GetReducer<M, M[]>) => M[];
export type StreamMethod<P, R> = (init: Init<R>, getReducer: GetReducer<P, R>) => R;
export type Grouping<P, M, R> = {
  grouping: GroupingMethod<P, M, R>,
  list: ListMethod<M>,
  stream: StreamMethod<M, R>,
};

// TODO 型ちがうかも。ちょっと難しいな

function createFrom<P, M, R>(layerdReducer: LayerdReducer<P, M>): Grouping<P, M, R> {

  const groupingMethod: GroupingMethod<P> = (keys, getReducer) => createFrom(grouping(layerdReducer, keys, getReducer));
  const listMethod: ListMethod<M> = (getReducer) => list(layerdReducer, getReducer);
  const streamMethod: StreamMethod<M, R> = (init, getReducer) => stream(layerdReducer, init, getReducer);

  return {
    grouping: groupingMethod,
    list: listMethod,
    stream: streamMethod,
  };
}

export function create<P, M, R>(): Grouping<P, M, R> {

  const shouldReset: ShouldReset<P> = (before, parameter) => true;
  const init: Init<P> = () => undefined;
  const reducer: Reducer<P, P> = (acc, parameter) => parameter; // TODO ここにconsole.debugしこめる

  const layerdReducer = first(init, shouldReset, reducer);

  const groupingMethod: GroupingMethod<P, M, R> = (keys, getReducer) => createFrom(grouping(layerdReducer, keys, getReducer));
  const listMethod: ListMethod<M> = (getReducer) => list(layerdReducer, getReducer);
  const streamMethod: StreamMethod<M, R> = (init, getReducer) => stream(layerdReducer, init, getReducer);

  return {
    grouping: groupingMethod,
    list: listMethod,
    stream: streamMethod,
  };
}
