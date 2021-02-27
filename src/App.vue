<template>
  <div id="app">
    <h3>Synonyms search tool</h3>
    <autocomplete
      class="autocomplete"
      :search="search"
      auto-select
      @submit="onSubmit"
    ></autocomplete>
    <ul id="selectedGraph">
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
      dictionary: [
        {
          value: "wash",
          index: "0",
          graphIndex: "0",
        },
        {
          value: "clean",
          index: 1,
          graphIndex: 0,
        },
        {
          value: "dirty",
          index: 0,
          graphIndex: 1,
        },
        {
          value: "unclean",
          index: 1,
          graphIndex: 1,
        },
      ],
      graphs: [
        ["wash", "clean"],
        ["dirty", "unclean"],
      ],
      selectedGraph: [],
    };
  },
  methods: {
    search(input) {
      if (input.length < 1) {
        return [];
      }
      const foundWords = this.findWords(input);
      const values = foundWords.map(({ value }) => value);
      return values;
    },
    findWords(input) {
      return this.dictionary.filter((word) => {
        return word.value.toLowerCase().startsWith(input.toLowerCase());
      });
    },
    onSubmit(result) {
      if (!result) {
        return;
      }
      const foundWord = this.findWords(result)[0];
      this.selectedGraph = this.graphs[foundWord.graphIndex];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
