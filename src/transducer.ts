
// TODO trancducer を作る
// - map
// - filter
// - reduce
// - end
//
// endで最後のreducerになる


// 型つけられない
// @ts-ignore
function compose(...reducers) {
  const [ head, ...rest ] = reducers.reverse();
  return rest.reduce((acc, reducer) => reducer(acc), head);
}


const mapping = f => reducing => (acc, e) => 
    reducing(acc, f(e))
const filtering = f => reducing => (acc, e) => 
	f(e) 
    ? reducing(acc, e) 
    : reducing(acc, undefined)
const folding = f => x => reducing => (acc, e) => 
	acc.length === 0 
    ? reducing(acc, f(x, e))
    : reducing(acc, f(acc[acc.length-1], e))  
const taking = n => reducing => (acc, e) => 
	acc.length < n 
    ? reducing(acc, e) 
    : reducing(acc, undefined)

const concatF = (acc, e) => 
    e || e===0 
    ? [...acc, e] 
    : [...acc]

const intoArray = (...fs) => xs => 
    xs.reduce( compose( ...fs )( concatF )
    , []
    );


