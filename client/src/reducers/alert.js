const initialState = []

export default function (state = initialState, action) {

  const { type, payload } = action
  
  switch (type) {
    case 'SET_ALERT':
      return [...state, payload];
    case 'REMOVE_ALERT':
      return state.filter(alert => alert.id !== payload) //payload is id in this case
    default:
      return state
  }
}