const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
}

export default function (state = initialState, action) {
  const { payload, type } = action
  switch (type) {
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'ACCOUNT_DELETED':
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    default:
      return state
  }
}