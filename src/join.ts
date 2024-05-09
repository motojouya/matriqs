
// TODO join を作る
// こんな感じかなー
//
// - base<P>: (resource: Iterable<P>) => Joiner<P>
// - innerJoin<L, R, G>: (joiner: Joiner<L>, resource: Iterable<R>, on: (left: L, right: R) => boolean) => Joiner<G>
// - leftJoin<L, R, G>: (joiner: Joiner<L>, resource: Iterable<R>, on: (left: L, right: R) => boolean) => Joiner<G>
// - execute<G>: (joiner: Joiner<G>) => Iterable<G>
//
// executeの戻り値はgeneraterにしようかな

