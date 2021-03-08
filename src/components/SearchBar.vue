<template>
  <div class="search-bar" id="search">
    <h1>Synonyms Search Tool</h1>
    <autocomplete
      :id="'serach-bar'"
      class="autocomplete autocomplete__search"
      :search="searchBar"
      @submit="getSet"
    ></autocomplete>
    <transition name="slide-fade">
      <h3 v-if="noSearchResults && getCurrentWord">
        No synonyms found for "{{ getCurrentWord }}", would you like to add
        some?
      </h3>
    </transition>
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
      noSearchResults: false,
    };
  },
  methods: {
    ...mapMutations(["setShowInputBar", "setSelectedSet", "setCurrentWord"]),
    ...mapActions(["search"]),
    searchBar(input) {
      if (!input.length) {
        this.setSelectedSet([]);
        this.setCurrentWord("");
        return [];
      }
      this.noSearchResults = false;

      this.setShowInputBar(false);
      const serchResult = this.search(input);
      if (!serchResult.length) {
        this.setCurrentWord(input);
      }
      return serchResult;
    },
    getSet(result) {
      if (!result) {
        console.log("true!");
        this.setShowInputBar(true);
        this.noSearchResults = true;
        return;
      }
      this.noSearchResults = false;
      this.setCurrentWord(result);
      this.setSelectedSet(this.getSets[this.getWordMap[result].setKey]);
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
