<template>
  <div id="app">
    <h3>Synonyms search tool</h3>
    <autocomplete
      :id="'serach-bar'"
      class="autocomplete"
      :search="searchBar"
      auto-select
      @submit="getSet"
    ></autocomplete>
    <div id="input" v-if="enableAddWord">
      <h3>Add new set of synonyms</h3>
      <autocomplete
        :id="'input-bar'"
        class="autocomplete autocomplete__input"
        :search="inputBar"
        @submit="pushToNewSynonySet"
      >
      </autocomplete>
      <ul id="new-set">
        <li v-for="word in newSynonymSet" :key="word">{{ word }}</li>
      </ul>
      <button @click="addSynonyms">Add new synonyms</button>
    </div>
    <ul id="selected-set">
      <li v-for="word in selectedSet" :key="word">
        {{ word }}
      </li>
    </ul>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
export default {
  name: "App",
  components: {
    Autocomplete,
  },
  data() {
    return {
      wordList: [],
      wordMap: {},
      sets: {},
      selectedSet: [],
      newSynonymSet: [],
      enableAddWord: true,
      showSuggestion: true,
      newWordInput: "",
    };
  },
  methods: {
    searchBar(input) {
      if (input.length < 1) {
        this.enableAddWord = true;
        this.selectedSet = [];
        return [];
      }
      this.enableAddWord = false;
      return this.search(input);
    },
    inputBar(input) {
      const result = this.search(input);
      if (!result.length) {
        this.showSuggestion = false;
        this.newWordInput = input;
      } else {
        this.showSuggestion = true;
      }
      return result;
    },
    search(input) {
      if (input.length < 1) {
        return [];
      }
      return this.findWordsInwordList(input);
    },
    findWordsInwordList(input) {
      const result = this.wordList.filter((entry) => {
        return entry.toLowerCase().startsWith(input.toLowerCase());
      });
      return result;
    },
    getSet(result) {
      if (!result) {
        return;
      }
      this.selectedSet = this.sets[this.wordMap[result].setKey];
    },
    pushToNewSynonySet(result) {
      const newWord = (result ? result : this.newWordInput)
        .toLowerCase()
        .trim();
      if (newWord.length >= 1 && !this.newSynonymSet.includes(newWord)) {
        this.newSynonymSet.push(newWord);
      }
    },
    addSynonyms() {
      if (!this.canAddSet) {
        return;
      }
      const existingWords = [];
      this.newSynonymSet.forEach((word) => {
        if (this.wordMap[word]) {
          existingWords.push(this.wordMap[word]);
        }
      });
      if (existingWords.length < 1) {
        const key = this.$uuid.v4();
        this.sets[key] = new Set();
        this.newSynonymSet.forEach((word) => {
          this.insertWord(word, key);
          this.sets[key].add(word);
        });
      } else if (existingWords.length === 1) {
        const setKey = existingWords[0].setKey;

        this.newSynonymSet.forEach((word) => {
          if (word === existingWords[0].value) {
            return;
          }
          this.insertWord(word, setKey);
          this.sets[setKey].add(word);
        });
      } else if (existingWords.length > 1) {
        const setKeys = new Set(existingWords.map(({ setKey }) => setKey));
        const setKey = this.$uuid.v4();
        let superSet = new Set();

        setKeys.forEach((key) => {
          superSet = this.union(superSet, this.sets[key], setKey);
          delete this.sets[key];
        });
        this.sets[setKey] = superSet;

        this.newSynonymSet.forEach((word) => {
          if (
            existingWords.some((existingWord) => existingWord.value === word)
          ) {
            return;
          }
          this.insertWord(word, setKey);
          this.sets[setKey].add(word);
        });
      }
      this.newSynonymSet = [];
    },
    union(setA, setB, setKey) {
      let _union = new Set(setA);
      for (let word of setB) {
        this.wordMap[word].setKey = setKey;
        _union.add(word);
      }
      return _union;
    },
    insertWord(word, setKey) {
      this.wordMap[word] = {
        value: word,
        setKey,
      };
      this.wordList.push(word);
    },
  },
  computed: {
    canAddSet() {
      return this.newSynonymSet.length > 1;
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.autocomplete {
  &__input {
    max-width: 200px;
  }
}
</style>
