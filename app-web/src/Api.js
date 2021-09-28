import Cookies from 'js-cookie';

const API_BASE = "https://api.squeet.co/api/";

const API = { API_BASE, AUTH_HEADER: () => { return { Token: Cookies.get('squeet_auth') }; } };

export default API;