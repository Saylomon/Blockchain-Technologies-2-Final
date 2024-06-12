<template>
  <div class="home">
    <h1>Voting Platform</h1>
    <button @click="connectWalletHandler" :disabled="isButtonDisabled">Connect Wallet</button>

    <div v-if="wallet.address">
      <h2>Wallet Address: {{ wallet.address }}</h2>
      <h2>Chain: {{ wallet.chain }}</h2>
      <h2>Chain ID: {{ wallet.chainId }}</h2>
    </div>

    <div>
      <h1>Vote for Candidate</h1>
      <input v-model="candidateId" placeholder="Candidate ID" />
      <button @click="voteHandler" :disabled="!wallet.address || isVoteButtonDisabled">Vote</button>
    </div>

    <div>
      <h1>Candidates List</h1>
      <ul v-if="candidates.length > 0">
        <li v-for="candidate in candidates" :key="candidate.id">
          ID: {{ candidate.id }} <br/>
          Name: {{ candidate.name }} <br/>
          Votes: {{ candidate.voteCount }} <br/>
        </li>
      </ul>
      <div v-else>
        <p>No candidates available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      candidateId: null,
      isButtonDisabled: false,
      isVoteButtonDisabled: false,
    }
  },
  computed: {
    ...mapState(['wallet', 'candidates'])
  },
  methods: {
    ...mapActions(['connectWallet', 'vote', 'fetchCandidates']),
    async connectWalletHandler() {
      this.isButtonDisabled = true;
      try {
        await this.connectWallet()
        await this.fetchCandidates()
      } catch (error) {
        console.error("Error connecting wallet:", error)
        alert(`Error connecting wallet: ${error.message}`)
      } finally {
        this.isButtonDisabled = false;
      }
    },
    async voteHandler() {
      this.isVoteButtonDisabled = true;
      try {
        await this.vote(Number(this.candidateId))
        this.candidateId = null
      } catch (error) {
        console.error("Error voting:", error)
        alert(`Error voting: Error Candidate ID`)
      } finally {
        this.isVoteButtonDisabled = false;
      }
    },
    checkNetworkStatus() {
      if (!navigator.onLine) {
        alert("You are offline. Please check your internet connection.");
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('offline', this.checkNetworkStatus);
  },
  async mounted() {
    window.addEventListener('offline', this.checkNetworkStatus);

    if (this.wallet.address) {
      await this.fetchCandidates()
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  background: #121212;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

h1 {
  font-size: 3em;
  padding-top: 70px;
  color: #fff;
  text-shadow: 0 0 5px #0ef, 0 0 10px #0ef, 0 0 15px #0ef;
}

h2, h3 {
  margin-bottom: 10px;
  color: #fff;
}

button {
  margin-bottom: 20px;
  padding: 20px 40px;
  background: #fff;
  color: #121212;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 3px #fff;
  text-shadow: 0 0 5px #0ef, 0 0 10px rgb(255, 255, 255), 0 0 15px rgb(255, 255, 255);
  transition: transform 0.2s;
  font-size: large;
}

button:hover {
  transform: scale(1.20);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

input {
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 5px;
  background: #1c1c1c;
  color: #fff;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
  padding: 10px;
  background: #1c1c1c;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #fff;
  font-size: 20px;
}
</style>
