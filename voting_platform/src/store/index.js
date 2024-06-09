import { createStore } from 'vuex';
const ethers = require('ethers');

const Provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/iD99rSDpFWeLjYiSQPm6fzYcuRxG7f4J');
const CONTRACT_ADDRESS = "0xdBB70315983Fdc3F18500ee7FE95c835AAA40675";
import { ABI } from '@/contracts/IndependentVotingPlatform.abi.js';

export default createStore({
  state: {
    provider: Provider,
    signer: null,
    contract: null,
    wallet: {
      address: null,
      chain: null,
      chainId: null,
    },
    candidates: [],
    votingStatus: {
      started: false,
      ended: false,
    },
    currentTime: null,
    winner: null,
    results: [],
    electionResult: null // Добавлено состояние electionResult
  },
  getters: {
    getCandidateById: (state) => (id) => {
      return state.candidates.find(candidate => candidate.id === id);
    }
  },
  mutations: {
    setCurrentTime(state, time) {
      state.currentTime = time;
    },
    setSigner(state, signer) {
      state.signer = signer;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, address) {
      state.wallet.address = address;
    },
    setChain(state, chain) {
      state.wallet.chain = chain;
    },
    setChainId(state, chainId) {
      state.wallet.chainId = chainId;
    },
    setCandidates(state, candidates) {
      state.candidates = candidates;
    },
    setVotingStatus(state, status) {
      state.votingStatus = status;
    },
    setWinner(state, winner) {
      state.winner = winner;
    },
    setResults(state, results) {
      state.results = results;
    },
    setElectionResult(state, result) { // Добавлено изменение electionResult
      state.electionResult = result;
    }
  },
  actions: {
    async connectWallet({ commit, state }) {
        try {
          if (typeof window.ethereum !== 'undefined') {
            console.log("Ethereum client installed!");
            if (ethereum.isMetaMask === true) {
              console.log("Metamask installed!");
              if (!ethereum.isConnected()) {
                console.log("Metamask is not connected!");
                await ethereum.enable();
              }
              console.log("Metamask connected!");
            } else {
              alert("Metamask is not installed!");
              return;
            }
          } else {
            alert("Ethereum client is not installed!");
            return;
          }
  
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          commit('setWalletAddress', accounts[0]);
          console.log(`Account ${accounts[0]} connected`);
  
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          commit('setChain', network.name);
          commit('setChainId', network.chainId);
  
          const signer = provider.getSigner();
          commit('setSigner', signer);
  
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          commit('setContract', contract);
  
          ethereum.on('accountsChanged', async (accounts) => {
            commit('setWalletAddress', accounts[0]);
            console.log(`Account ${accounts[0]} connected`);
          });
  
          ethereum.on('chainChanged', async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            commit('setChain', network.name);
            commit('setChainId', network.chainId);
  
            const signer = provider.getSigner();
            commit('setSigner', signer);
  
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            commit('setContract', contract);
          });
        } catch (error) {
          console.error("Error connecting wallet:", error);
          throw error;
        }
      },
    async getCandidates({ commit, state }) {
      try {
        const candidates = await state.contract.getCandidates();
        commit('setCandidates', candidates);
      } catch (error) {
        console.error("Error getting candidates:", error);
      }
    },
    async vote({ state, dispatch }, candidateId) {
        try {
          await state.contract.vote(candidateId);
          await dispatch('fetchCandidates');
        } catch (error) {
          console.error("Error voting:", error);
          throw error;
        }
    },
    async startVoting({ commit, state }, { startTime, endTime }) {
      try {
        const tx = await state.contract.startVoting(startTime, endTime);
        await tx.wait();
        commit('setVotingStatus', { started: true, ended: false });
      } catch (error) {
        console.error("Error starting voting:", error);
      }
    },
    async endVoting({ commit, state }) {
      try {
        const tx = await state.contract.endVoting();
        await tx.wait();
        commit('setVotingStatus', { started: false, ended: true });
      } catch (error) {
        console.error("Error ending voting:", error);
      }
    },
    async addCandidate({ commit, state }, candidateName) {
      try {
        const tx = await state.contract.addCandidate(candidateName);
        await tx.wait();
      } catch (error) {
        console.error("Error adding candidate:", error);
      }
    },
    async getWinner({ state, commit }) {
      try {
        await state.contract.getWinner();  // Вызов функции getWinner контракта
        const result = await state.contract.electionResult();  // Получение результата из electionResult
        commit('setElectionResult', {
          candidateId: result.candidateId.toNumber(),
          candidateName: result.candidateName,
          voteCount: result.voteCount.toNumber()
        });
      } catch (error) {
        console.error("Error getting winner:", error);
        throw error;
      }
    },
    async getTime({ commit, state }) {
      try {
        const currentTime = await state.contract.getTime();
        commit('setCurrentTime', currentTime.toNumber());
      } catch (error) {
        console.error("Error getting current time:", error);
      }
    },
    async fetchElectionResult({ state, commit }) { // Добавлено действие fetchElectionResult
      try {
        const result = await state.contract.electionResult();
        commit('setElectionResult', {
          candidateId: result.candidateId.toNumber(),
          candidateName: result.candidateName,
          voteCount: result.voteCount.toNumber()
        });
      } catch (error) {
        console.error("Error fetching election result:", error);
        throw error;
      }
    },
    async fetchCandidates({ state, commit }) {
        try {
          const candidates = [];
          const count = await state.contract.candidatesCount();
          for (let i = 1; i <= count; i++) {
            const candidate = await state.contract.candidates(i);
            candidates.push({ id: candidate.id, name: candidate.name, voteCount: candidate.voteCount });
          }
          commit('setCandidates', candidates);
        } catch (error) {
          console.error("Error fetching candidates:", error);
          throw error;
        }
      },
  },
  modules: {}
});
