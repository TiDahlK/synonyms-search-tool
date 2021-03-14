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
    currentSetSize: 0,
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
      state.selectedSet = set;
      state.currentSetSize = set.size;
    },
    createSet(state, { setKey, set = new Set() }) {
      state.sets[setKey] = set;
    },
    deleteSet(state, setKey) {
      delete state.sets[setKey];
    },
    removeWordFromMap(state, word) {
      delete state.wordMap[word];
    },
    removeWordFromList(state, word) {
      state.wordList.splice(state.wordList.indexOf(word), 1);
    },
    removeWordFromSet(state, { word, setKey }) {
      state.sets[setKey].delete(word);
      state.currentSetSize = state.sets[setKey].size;
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
    findWordsInList({ state }, input) {
      if (input.length < 1) {
        return [];
      }
      const result = state.wordList.filter((entry) => {
        return entry.toLowerCase().startsWith(input.toLowerCase());
      });
      return result;
    },
    insertWord({ commit }, { word, setKey }) {
      commit("addWordToMap", { word, setKey });
      commit("addWordToList", word);
    },
    removeWord({ state, commit }, word) {
      const setKey = state.wordMap[word].setKey;

      commit("removeWordFromMap", word);
      commit("removeWordFromList", word);
      commit("removeWordFromSet", { word, setKey });
    },
  },
  getters: {
    getWordMap: (state) => {
      return state.wordMap;
    },
    getSets: (state) => {
      return state.sets;
    },
    getSetOnWord: (state) => (word) => {
      return state.sets[state.wordMap[word].setKey];
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
    getSize: (state) => {
      return state.currentSetSize;
    },
  },
});
