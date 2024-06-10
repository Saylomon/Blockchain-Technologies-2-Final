<template>
  <div class="results">
    <h1>Voting Results</h1>
    <button @click="connectWalletHandler">Connect Wallet</button>

    <div v-if="wallet.address">
      <h2>Wallet Address: {{ wallet.address }}</h2>
      <h2>Chain: {{ wallet.chain }}</h2>
      <h2>Chain ID: {{ wallet.chainId }}</h2>
    </div>

    <div v-if="hasElectionResult">
      <h1>Results</h1>
      <p>Candidate ID: {{ electionResult.candidateId }}</p>
      <p>Candidate Name: {{ electionResult.candidateName }}</p>
      <p>Vote Count: {{ electionResult.voteCount }}</p>
    </div>
    <div v-else>
      <p>No results available.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['wallet', 'electionResult']),
    hasElectionResult() {
      const { candidateId, candidateName, voteCount } = this.electionResult || {};
      return candidateId || candidateName || voteCount;
    }
  },
  methods: {
    ...mapActions(['connectWallet', 'fetchElectionResult']),
    async connectWalletHandler() {
      try {
        await this.connectWallet()
        await this.fetchElectionResult()
      } catch (error) {
        console.error("Error connecting wallet and fetching results:", error)
      }
    }
  },
  mounted() {
    if (this.wallet.address) {
      this.fetchElectionResult()
    }
  }
}
</script>

<style scoped>
.results {
  padding: 20px;
  background: #121212;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

h1 {
  font-size: 3em;
  color: #fff;
  text-shadow: 0 0 5px #17b642, 0 0 10px #17b642, 0 0 15px #17b642;
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
  text-shadow: 0 0 5px #17b642, 0 0 10px #ffffff, 0 0 15px #ffffff;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.20);
}

p {
  margin-bottom: 10px;
  padding: 10px;
  background: #1c1c1c;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #fff;
}
</style>

