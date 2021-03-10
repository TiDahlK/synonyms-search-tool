import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    wordList: [],
    wordMap: {},
    sets: {},
    selectedSet: [],
    showInputBar: false,
    hasResult: false,
    currentWord: "",
  }),
  mutations: {
    setShowInputBar(state, show) {
      state.showInputBar = show;
    },
    setHasResult(state, hasResult) {
      state.hasResult = hasResult;
    },
    setCurrentWord(state, word) {
      state.currentWord = word;
    },
    setSelectedSet(state, set) {
      Vue.set(state, "selectedSet", set);
    },
    createSet(state, { setKey, set = new Set() }) {
      state.sets[setKey] = set;
    },
    deleteSet(state, setKey) {
      delete state.sets[setKey];
    },
    addWordToSet(state, { word, setKey }) {
      state.sets[setKey].add(word);
    },
    addWordToMap(state, { word, setKey }) {
      state.wordMap[word] = {
        value: word,
        setKey,
      };
    },
    updateWordkey(state, { word, setKey }) {
      state.wordMap[word].setKey = setKey;
    },
    addWordToList(state, word) {
      state.wordList.push(word);
    },
  },
  actions: {
    search({ dispatch }, input) {
      if (input.length < 1) {
        return [];
      }
      return dispatch("findWordsInwordList", input);
    },
    findWordsInwordList({ state }, input) {
      const result = state.wordList.filter((entry) => {
        return entry.toLowerCase().startsWith(input.toLowerCase());
      });
      return result;
    },
    insertWord({ commit }, { word, setKey }) {
      commit("addWordToMap", { word, setKey });
      commit("addWordToList", word);
    },
  },
  getters: {
    getWordMap: (state) => {
      return state.wordMap;
    },
    getSets: (state) => {
      return state.sets;
    },
    getSelectedSet: (state) => {
      return state.selectedSet;
    },
    getShowInputBar: (state) => {
      return state.showInputBar;
    },
    getCurrentWord: (state) => {
      return state.currentWord;
    },
    getHasResult: (state) => {
      return state.hasResult;
    },
  },
});
