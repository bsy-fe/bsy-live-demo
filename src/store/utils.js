
// eslint-disable-next-line import/prefer-default-export
export const setSomething = (state, payload) => {
  return {
    ...state,
    ...payload
  }
}
