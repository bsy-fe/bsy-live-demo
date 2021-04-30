import { setSomething } from '../utils'

export default {
  state: {
    activeKey: 1
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setActiveKey(state, payload) {
      return setSomething(state, payload)
    }
  }
  // effects: dispatch => ({
  //   // handle state changes with impure functions.
  //   // use async/await for async actions
  // }),
}
