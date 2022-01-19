const loginSocket = (state) => state.auth;
const isAuth = (state) => state.auth.token;
const userName = (state) => state.auth.user.username;
const createDate = (state) => state.auth.user.createdAt;
const isLoggedIn = (state) => state.auth.isLogIn;
const isAdmin = (state) => state.auth.user.isAdmin;
const isMuted = (state) => state.auth.user.isMuted;

const selectors = {
  loginSocket,
  isAuth,
  userName,
  createDate,
  isLoggedIn,
  isAdmin,
  isMuted,
};

export default selectors;
