const mutations = {
  user(state, user) {
    state.user = user;
    state.authz = true;
  }
}

export default mutations;
