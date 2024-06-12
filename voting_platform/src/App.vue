<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/admin" :class="{ disabled: !isAuthorized }">Admin</router-link>
      <router-link to="/results">Show Results</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['wallet']),
    isAuthorized() {
      const authorizedAddress = '0x8ec0d8a512c58dd643967d577fea110f60f64bd8'.toLowerCase();
      const walletAddress = this.wallet.address ? this.wallet.address.toLowerCase() : null;
      return walletAddress && walletAddress === authorizedAddress;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  background: #121212;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

nav {
  width: 100%;
  background: #1c1c1c;
  box-shadow: 0 0 10px rgb(255, 255, 255);
  border-bottom: 2px solid rgb(255, 255, 255);
  padding: 20px 0;
  position: fixed;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  transition: background 0.3s;
}

nav a {
  font-weight: bold;
  color: rgb(255, 255, 255);
  margin: 0 15px;
  text-decoration: none;
  font-size: 1.5em; /* Increase font size */
  padding: 10px 20px; /* Add padding for larger clickable area */
  border-radius: 5px;
  transition: color 0.2s, text-shadow 0.2s, background 0.2s;
}

nav a:hover {
  color: #121212;
  background: rgb(255, 255, 255);
  text-shadow: 0 0 5px rgb(255, 255, 255), 0 0 10px rgb(255, 255, 255);
}

nav a.router-link-exact-active {
  color: #121212;
  background: rgb(255, 255, 255);
  text-shadow: 0 0 5px rgb(255, 255, 255), 0 0 10px rgb(255, 255, 255);
}

nav a.disabled {
  pointer-events: none;
  opacity: 0.6;
}

router-view {
  padding: 60px 20px 20px; /* Adjusted to ensure content is not hidden behind the navbar */
  flex-grow: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
