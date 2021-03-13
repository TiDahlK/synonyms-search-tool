<template>
  <div class="search-bar">
    <h1>Synonyms Search Tool</h1>
    <autocomplete
      :id="'serach-bar'"
      class="autocomplete autocomplete__search"
      :search="searchFor"
      @submit="getSet"
    ></autocomplete>
    <transition name="slide-fade">
      <result-list
        :resultId="'search-result'"
        :showError="showError"
        :errorMessage="errorMessage"
        :listTitle="listTitle"
        :wordList="displaySet"
        @remove="removeWord($event)"
      />
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import ResultList from "./ResultList.vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
export default {
  name: "SearchBar",
  components: {
    Autocomplete,
    ResultList,
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
    ...mapActions(["findWordsInList", "removeWord"]),
    searchFor(input) {
      if (!input.length) {
        this.setSelectedSet([]);
        this.setCurrentWord("");
        return [];
      }
      this.setShowInputBar(false);
      const serchResult = this.findWordsInList(input);

      if (!serchResult.length) {
        if (this.getCurrentWord !== input) {
          this.setSelectedSet([]);
        }
        this.setHasResult(true);
        this.setCurrentWord(input);
      }
      return serchResult;
    },
    getSet(result) {
      if (!result && !this.getWordMap[this.getCurrentWord]) {
        this.setShowInputBar(true);
        this.setHasResult(false);
        this.setSelectedSet([]);
        return;
      } else if (result) {
        this.setHasResult(true);
        this.setCurrentWord(result);
        this.setSelectedSet(this.getSets[this.getWordMap[result].setKey]);
      } else if (this.getWordMap[this.getCurrentWord]) {
        this.setHasResult(true);
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
      "getHasResult",
      "getSize",
      "getSelectedSet",
    ]),
    errorMessage() {
      return `No synonyms found for "${this.getCurrentWord}", would you like to add
        some?`;
    },
    showError() {
      return (!this.getHasResult || this.getSize <= 1) && !!this.getCurrentWord;
    },
    listTitle() {
      return `"${this.getCurrentWord}" is synonymous with`;
    },
    displaySet() {
      if (this.getSize && this.getSelectedSet) {
        return Array.from(this.getSelectedSet).filter(
          (word) => word !== this.getCurrentWord
        );
      }
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  text-align: center;
}
</style>
