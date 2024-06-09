<template>
    <div class="admin">
        <h1>Admin Page</h1>
        <button @click="connectWalletHandler">Connect Wallet</button>

        <div v-if="wallet.address">
            <h2>Wallet Address: {{ wallet.address }}</h2>
            <h2>Chain: {{ wallet.chain }}</h2>
            <h2>Chain ID: {{ wallet.chainId }}</h2>
        </div>

        <div>
            <h1>Add Candidate</h1>
            <input v-model="newCandidate" placeholder="Candidate Name" />
            <button @click="addCandidateHandler">Add Candidate</button>
        </div>

        <div>
            <h1>Control Voting</h1>
            <input v-model="startTime" placeholder="Start Time (Unix Timestamp)" />
            <input v-model="endTime" placeholder="End Time (Unix Timestamp)" />
            <button @click="startVotingHandler">Start Voting</button>
            <button @click="endVotingHandler">End Voting</button>
        </div>

        <div>
            <h1>Get Current Time</h1>
            <button @click="getTimeHandler">Get Current Time</button>
            <div v-if="currentTime">
                <h3>
                    Current Time: <span ref="currentTime">{{ currentTime }}</span>
                    <button class="copyBtn" @click="copyToClipboard">Copy</button>
                </h3>
            </div>
        </div>

        <div>
            <h1>Get Winner</h1>
            <button @click="getWinnerHandler">Get Winner</button>
            <div v-if="winner">
                <p>Winner ID: {{ winner.id }}</p>
                <p>Winner Name: {{ winner.name }}</p>
                <p>Vote Count: {{ winner.voteCount }}</p>
            </div>
        </div>
    </div>
</template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  
  export default {
    data() {
      return {
        startTime: '',
        endTime: '',
        newCandidate: ''
      }
    },
    computed: {
      ...mapState(['wallet', 'candidates', 'votingStatus', 'winner', 'currentTime'])
    },
    watch: {
      winner(newWinner) {
        if (newWinner) {
          alert(`Winner: ${newWinner.name} with ${newWinner.voteCount} votes`)
        }
      }
    },
    methods: {
      ...mapActions(['connectWallet', 'startVoting', 'endVoting', 'getWinner', 'addCandidate', 'getTime']),
      async connectWalletHandler() {
        try {
          await this.connectWallet()
        } catch (error) {
          console.error("Error connecting wallet:", error)
          alert(`Error connecting wallet: ${error.message}`)
        }
      },
      async addCandidateHandler() {
        try {
          await this.addCandidate(this.newCandidate)
          this.newCandidate = ''
        } catch (error) {
          console.error("Error adding candidate:", error)
          alert(`Error adding candidate: ${error.message}`)
        }
      },
      async startVotingHandler() {
        try {
          const startTime = parseInt(this.startTime, 10)
          const endTime = parseInt(this.endTime, 10)
          await this.startVoting({ startTime, endTime })
          this.startTime = ''
          this.endTime = ''
        } catch (error) {
          console.error("Error starting voting:", error)
          alert(`Error starting voting: ${error.message}`)
        }
      },
      async endVotingHandler() {
        try {
          await this.endVoting()
        } catch (error) {
          console.error("Error ending voting:", error)
          alert(`Error ending voting: ${error.message}`)
        }
      },
      async getWinnerHandler() {
        try {
          await this.getWinner()
        } catch (error) {
          console.error("Error getting winner:", error)
          alert(`Error getting winner: ${error.message}`)
        }
      },
      async getTimeHandler() {
        try {
          await this.getTime()
        } catch (error) {
          console.error("Error getting time:", error)
        }
      },
        copyToClipboard() {
            const textToCopy = this.$refs.currentTime.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Time copied to clipboard!');
            }, err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }
  }
  </script>
  
  
<style scoped>
.admin {
  padding: 20px;
  background: #121212;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

h1 {
  font-size: 3em;
  padding-top: 70px;
  color: rgb(255, 255, 255);
  text-shadow: 0 0 5px rgb(208, 45, 208), 0 0 10px rgb(208, 45, 208), 0 0 15px rgb(208, 45, 208);
}

h2, h3 {
  margin-bottom: 10px;
  color: rgb(255, 255, 255);
}

button {
  margin-bottom: 20px;
  padding: 20px 40px;
  background: rgb(255, 255, 255);
  color: #121212;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgb(255, 255, 255), 0 0 20px rgb(255, 255, 255), 0 0 3px rgb(255, 255, 255);
  text-shadow: 0 0 5px rgb(208, 45, 208), 0 0 10px rgb(255, 255, 255), 0 0 15px rgb(255, 255, 255);
  transition: transform 0.2s;
}
.copyBtn{
  margin-bottom: 20px;
  margin-left: 10px;
  padding: 8px 16px;
  background: rgb(255, 255, 255);
  color: #121212;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgb(255, 255, 255), 0 0 20px rgb(255, 255, 255), 0 0 3px rgb(255, 255, 255);
  text-shadow: 0 0 5px rgb(208, 45, 208), 0 0 10px rgb(255, 255, 255), 0 0 15px rgb(255, 255, 255);
  transition: transform 0.2s;  
}

button:hover {
    transform: scale(1.20);
}

input {
  padding: 20px;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 5px;
  background: #1c1c1c;
  color: rgb(255, 255, 255);
  margin-bottom: 10px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.actions div {
  flex: 1;
}

.actions button {
  width: 80%;
  margin: 10px auto;
}
</style>