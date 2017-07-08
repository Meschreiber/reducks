/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                          - REDUX STORE -

  The primary API of redux is the 'createStore' method.

  The createStore function should return an object (the store).
  A store is a state-management mechanism that emits events when
  its state is updated.

  A store's state should _never_ be publically accessible or modifiable.
  It can only be accessed through the 'getState' method, and modified
  via the 'dispatch' method which takes objects known as 'actions'.
  Actions must have a 'type' property describing the action, and
  often carry some payload to update the state.
    const sampleAction = {
      type: 'ADD_DUCK',
      duck: { name: 'Donald Duck', color: 'white' }
    };

  The user must define a reducer function that specifies how the state
  should be updated when an action is dispatched. The reducer is then
  passed into createStore as the first argment. It takes the previous
  state, an action, and returns the next state.
    const sampleReducer = function(prevState=initialState, action) {
      // does things based on action, returns next state
    };
    
  The store can register 'subscriptions' via the 'subscribe' method.
  The subscribe method in functions that must be run when the state
  is updated. 'subscribe' returns a function (unsubscribe), which allows
  for its corresponding listener to be removed.
    const unsubscribe = store.subscribe(() => {
      console.log('State updated!');
    });

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== 'function') throw new TypeError('Reducer must be a function.')
  let state = reducer(preloadedState, { type: '@@init' })
  let listeners = []

  let store = {
    getState: () => state,
    dispatch: (action) => {
      if (typeof action !== 'object') throw new TypeError('Dispatches must receive objects.')
      if (!action.hasOwnProperty('type') || action.type === undefined) throw new Error('Actions must include types.')
      state = reducer(state, action)
      listeners.forEach(listener => listener())
      return action
    },
    subscribe: (listener) => {
      if (typeof listener !== 'function') throw new TypeError('Listener must be a function.')
      listeners.push(listener)
      let called = false
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1 && !called) {
          listeners.splice(index, 1);
        }
        called = true
      }
    },
    replaceReducer: (nextReducer) => {
       if (typeof nextReducer !== 'function') throw new TypeError('Reducer must be a function.')
       reducer = nextReducer
    }
  }
  if (typeof preloadedState === 'function') enhancer = preloadedState
  if (enhancer) {
    if (typeof enhancer !== 'function') throw new TypeError('Enhancer must be a function.')
    store = enhancer(store)
  }
  return store
}

module.exports = createStore;
