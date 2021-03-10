<template>
  <div class="search-bar" id="search">
    <h1>Synonyms Search Tool</h1>
    <autocomplete
      :id="'serach-bar'"
      class="autocomplete autocomplete__search"
      :search="searchFor"
      @submit="getSet"
    ></autocomplete>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
export default {
  name: "SearchBar",
  components: {
    Autocomplete,
  },
  props: {},
  data() {
    return {
      showSuggestion: true,
    };
  },
  methods: {
    ...mapMutations([
      "setShowInputBar",
      "setSelectedSet",
      "setCurrentWord",
      "setHasResult",
    ]),
    ...mapActions(["search"]),
    searchFor(input) {
      if (!input.length) {
        this.setSelectedSet([]);
        this.setCurrentWord("");
        return [];
      }

      this.setShowInputBar(false);
      const serchResult = this.search(input);

      if (!serchResult.length) {
        if (this.getCurrentWord !== input) {
          this.setSelectedSet([]);
        }
        this.setHasResult(false);
        this.setCurrentWord(input);
      }
      return serchResult;
    },
    getSet(result) {
      if (!result && !this.getWordMap[this.getCurrentWord]) {
        this.setShowInputBar(true);
        this.setHasResult(true);
        this.setSelectedSet([]);
        return;
      } else if (result) {
        this.setHasResult(false);
        this.setCurrentWord(result);
        this.setSelectedSet(this.getSets[this.getWordMap[result].setKey]);
      } else if (this.getWordMap[this.getCurrentWord]) {
        this.setHasResult(false);
        this.setSelectedSet(
          this.getSets[this.getWordMap[this.getCurrentWord].setKey]
        );
      }
    },
  },
  computed: {
    ...mapGetters([
      "getWordMap",
      "getSets",
      "getCurrentWord",
      "getShowInputBar",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  text-align: center;
}
</style>
