/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                            - MIDDLEWARE -

  applyMiddleware returns a store enhancer which modifies the dispatch
  method with 'middlewares'. As a refresher, an enhancer is a
  function that takes the createStore function and modifies it. The
  modified createStore should take the same function signature as the
  original, and similarly return a store object with the appropriate
  APIs (getState, dispatch, subscribe, and replaceReducer).
  
  applyMiddleware takes many middlewares, so we will need to use the
  compose function to combine all the middlewares and apply them to
  dispatch all at once.

  For an example of a redux middleware, check out redux-thunk:
    https://github.com/gaearon/redux-thunk/blob/master/src/index.js

  Middleware takes in an object with references to a store's dispatch
  and getState methods. This function returns _another function_ that
  receives dispatch, and returns a modified dispatch (much like the
  enhancer takes in createStore and returns an enhanced createStore).

  With all the arrows in those functions, I don't blame you if you're
  a bit confused by this 3-level-deep higher order function... Take
  some time to study the redux-thunk middleware source code until you
  feel comfortable enough to move on.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const compose = require('./compose');

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    const middlewareAPI = {
      getState: store.getState,
      dispatch: store.dispatch
    }
    const middlewareChain = middlewares.map(middleware => middleware(middlewareAPI))
    // why do you have to use the spread operator for this middleware chain? Doesn't compose simply take an array of functions?
    const enhancedDispatch = compose(...middlewareChain)(store.dispatch)
    store.dispatch = enhancedDispatch
    return store
  }
}


// -- SOLUTION CODE ALSO DOES NOT PASS LAST SPEC ---
// function applyMiddleware(...middlewares) {
//   return (createStore) => {
//     return (reducer, preloadedState, enhancer) => {
//       const store = createStore(reducer, preloadedState, enhancer);

//       const middlewareAPI = {
//         getState: store.getState,
//         dispatch: store.dispatch,
//       };

//       const chain = middlewares.map(middleware => middleware(middlewareAPI));
//       const enhancedDispatch = compose(...chain)(store.dispatch);
//       store.dispatch = enhancedDispatch;

//       return store;
//     };
//   };
// }

module.exports = applyMiddleware;


// ----------- EXAMPLE OF THUNK -------------------------

// function createThunkMiddleware(extraArgument) {
//   return ({ dispatch, getState }) => next => action => {
//     if (typeof action === 'function') {
//       return action(dispatch, getState, extraArgument);
//     }

//     return next(action);
//   };
// }

// const thunk = createThunkMiddleware();
// thunk.withExtraArgument = createThunkMiddleware;

// export default thunk;