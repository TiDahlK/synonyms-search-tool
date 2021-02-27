<template>
  <div id="app">
    <h3>Synonyms search tool</h3>
    <autocomplete
      :id="'serach-bar'"
      class="autocomplete"
      :search="searchBar"
      auto-select
      @submit="getGraph"
    ></autocomplete>
    <div id="input" v-if="enableAddWord">
      <h3>Add new set of synonyms</h3>
      <autocomplete
        :id="'input-bar'"
        class="autocomplete autocomplete__input"
        :search="inputBar"
        @submit="pushToSet"
      >
      </autocomplete>
      <ul id="selected-graph">
        <li v-for="word in synonymSet" :key="word">{{ word }}</li>
      </ul>
      <button @click="addSynonyms">Add new synonyms</button>
    </div>
    <ul id="selected-graph">
      <li v-for="word in selectedGraph" :key="word">
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
      dictionary: [],
      wordMap: {},
      graphs: {},
      selectedGraph: [],
      synonymSet: [],
      enableAddWord: true,
      showSuggestion: true,
      newWordInput: "",
    };
  },
  methods: {
    searchBar(input) {
      if (input.length < 1) {
        this.enableAddWord = true;
        this.selectedGraph = [];
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
      return this.findWordsInDictionary(input);
    },
    findWordsInDictionary(input) {
      const result = this.dictionary.filter((entry) => {
        return entry.toLowerCase().startsWith(input.toLowerCase());
      });
      return result;
    },
    getGraph(result) {
      if (!result) {
        return;
      }
      this.selectedGraph = this.graphs[this.wordMap[result].graphKey].set;
    },
    pushToSet(result) {
      const newWord = (result ? result : this.newWordInput)
        .toLowerCase()
        .trim();
      if (newWord.length > 1 && !this.synonymSet.includes(newWord)) {
        this.synonymSet.push(newWord);
      }
    },
    addSynonyms() {
      const existingWords = [];
      this.synonymSet.forEach((word) => {
        if (this.wordMap[word]) {
          existingWords.push(this.wordMap[word]);
        }
      });
      if (existingWords.length < 1) {
        const key = this.$uuid.v4();
        this.graphs[key] = { key, set: new Set() };
        this.synonymSet.forEach((word) => {
          this.insertWord(word, key);
          this.graphs[key].set.add(word);
        });
      } else if (existingWords.length === 1) {
        const graphKey = existingWords[0].graphKey;

        this.synonymSet.forEach((word) => {
          if (word === existingWords[0].value) {
            return;
          }
          this.insertWord(word, graphKey);
          this.graphs[graphKey].set.add(word);
        });
      } else if (existingWords.length > 1) {
        const keys = existingWords.map(({ graphKey }) => graphKey);
        const graphKeys = new Set(keys);
        const graphKey = this.$uuid.v4();
        let superSet = new Set();

        graphKeys.forEach((key) => {
          superSet = this.union(superSet, this.graphs[key].set, graphKey);
          delete this.graphs[key];
        });
        this.graphs[graphKey] = { key: graphKey, set: superSet };

        this.synonymSet.forEach((word) => {
          if (
            existingWords.some((existingWord) => existingWord.value === word)
          ) {
            return;
          }
          this.insertWord(word, graphKey);
          this.graphs[graphKey].set.add(word);
        });
      }
      this.synonymSet = [];
    },
    union(setA, setB, graphKey) {
      let _union = new Set(setA);
      for (let word of setB) {
        this.wordMap[word].graphKey = graphKey;
        _union.add(word);
      }
      return _union;
    },
    insertWord(word, graphKey) {
      this.wordMap[word] = {
        value: word,
        graphKey,
      };
      this.dictionary.push(word);
    },
  },
  computed: {},
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
