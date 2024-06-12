<template>
    <div class="admin">
      <h1>Admin Page</h1>
      <button @click="connectWalletHandler" :disabled="isButtonDisabled">Connect Wallet</button>
  
      <div v-if="wallet.address">
        <h2>Wallet Address: {{ wallet.address }}</h2>
        <h2>Chain: {{ wallet.chain }}</h2>
        <h2>Chain ID: {{ wallet.chainId }}</h2>
      </div>
  
      <div>
        <h1>Add Candidate</h1>
        <input v-model="newCandidate" placeholder="Candidate Name" />
        <button @click="addCandidateHandler" :disabled="!wallet.address || isAddCandidateDisabled">Add Candidate</button>
      </div>
  
      <div>
        <h1>Control Voting</h1>
        <input v-model="startTime" placeholder="Start Time (Unix Timestamp)" />
        <input v-model="endTime" placeholder="End Time (Unix Timestamp)" />
        <button @click="startVotingHandler" :disabled="!wallet.address || isStartVotingDisabled">Start Voting</button>
        <button @click="endVotingHandler" :disabled="!wallet.address || isEndVotingDisabled">End Voting</button>
      </div>
  
      <div class="actions">
        <div>
          <h1>Get Current Time</h1>
          <button @click="getTimeHandler" :disabled="!wallet.address || isButtonDisabled">Get Current Time</button>
          <div v-if="currentTime">
            <h3>
              Current Time: <span ref="currentTime">{{ currentTime }}</span>
              <button class="copyBtn" @click="copyToClipboard('currentTime')">Copy</button>
            </h3>
          </div>
        </div>
  
        <div>
          <h1>Get Owner</h1>
          <button @click="getOwnerHandler" :disabled="!wallet.address || isButtonDisabled">Get Contract Owner</button>
          <div v-if="owner">
            <h3>
              Owner's Address: <span ref="owner">{{ owner }}</span>
              <button class="copyBtn" @click="copyToClipboard('owner')">Copy</button>
            </h3>
          </div>
        </div>
      </div>
  
      <div>
        <h1>Get Winner</h1>
        <button @click="getWinnerHandler" :disabled="!wallet.address || isGetWinnerDisabled">Get Winner</button>
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
        newCandidate: '',
        isButtonDisabled: false,
        isAddCandidateDisabled: false,
        isStartVotingDisabled: false,
        isEndVotingDisabled: false,
        isGetWinnerDisabled: false
      }
    },
    computed: {
      ...mapState(['wallet', 'candidates', 'votingStatus', 'winner', 'currentTime', 'owner'])
    },
    watch: {
      winner(newWinner) {
        if (newWinner) {
          alert(`Winner: ${newWinner.name} with ${newWinner.voteCount} votes`)
        }
      }
    },
    methods: {
      ...mapActions(['connectWallet', 'startVoting', 'endVoting', 'getWinner', 'addCandidate', 'getTime', 'getOwner']),
      async connectWalletHandler() {
        this.isButtonDisabled = true;
        try {
          await this.connectWallet()
        } catch (error) {
          console.error("Error connecting wallet:", error)
          alert(`Error connecting wallet: ${error.message}`)
        } finally {
          this.isButtonDisabled = false;
        }
      },
      async addCandidateHandler() {
        this.isAddCandidateDisabled = true;
        try {
          await this.addCandidate(this.newCandidate)
          this.newCandidate = ''
        } catch (error) {
          console.error("Error adding candidate:", error)
          alert(`Error adding candidate: ${error.message}`)
        } finally {
          this.isAddCandidateDisabled = false;
        }
      },
      async startVotingHandler() {
        this.isStartVotingDisabled = true;
        try {
          const startTime = parseInt(this.startTime, 10)
          const endTime = parseInt(this.endTime, 10)
          await this.startVoting({ startTime, endTime })
          this.startTime = ''
          this.endTime = ''
        } catch (error) {
          console.error("Error starting voting:", error)
          alert(`Error starting voting: ${error.message}`)
        } finally {
          this.isStartVotingDisabled = false;
        }
      },
      async endVotingHandler() {
        this.isEndVotingDisabled = true;
        try {
          await this.endVoting()
        } catch (error) {
          console.error("Error ending voting:", error)
          alert(`Error ending voting: ${error.message}`)
        } finally {
          this.isEndVotingDisabled = false;
        }
      },
      async getWinnerHandler() {
        this.isGetWinnerDisabled = true;
        try {
          await this.getWinner()
        } catch (error) {
          console.error("Error getting winner:", error)
          alert(`Error getting winner: ${error.message}`)
        } finally {
          this.isGetWinnerDisabled = false;
        }
      },
      async getTimeHandler() {
        this.isButtonDisabled = true;
        try {
          await this.getTime()
        } catch (error) {
          console.error("Error getting time:", error)
        } finally {
          this.isButtonDisabled = false;
        }
      },
      async getOwnerHandler() {
        this.isButtonDisabled = true;
        try {
          await this.getOwner()
        } catch (error) {
          console.error("Error getting owner:", error)
        } finally {
          this.isButtonDisabled = false;
        }
      },
      copyToClipboard(refName) {
        const textToCopy = this.$refs[refName].textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert(`${refName} copied to clipboard!`);
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
  
  .copyBtn {
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
  
  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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
    padding: 20px;
  }
  
  .actions button {
    width: 80%;
    margin: 10px auto;
  }
  </style>
  