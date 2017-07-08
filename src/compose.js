/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                            - COMPOSE -

  Compose is a convenient utility function provided by redux.

  It takes in a list of single-argument functions, and composes them
  from right to left, passing the return value of one into the next
  function to its left. Only the rightmost function may take multiple
  arguments. The return value is a function.

  e.g. compose(func1, func2, func3)(1, 2, 3) is equivalent to
       func1(func2(func3(1, 2, 3)))

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function compose(...funcs) {
  // funcs is an array of functions
  if (funcs.length === 0) return (...args) => args[0]
  return funcs.reduce((f, g) => (...args) => f(g(...args)))
}


module.exports = compose;
