import Cookies from 'js-cookie'

export const isLoggedIn = () => !!Cookies.get('AUTH_TOKEN_CLIENT')