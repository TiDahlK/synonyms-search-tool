<template>
  <div class="input-bar" id="input">
    <span :class="arrowClass" @click="setShowInputBar(!getShowInputBar)">
    </span>
    <transition name="slide-fade">
      <div v-if="getShowInputBar">
        <h3>{{ titleLabel }}</h3>
        <autocomplete
          :id="'input-bar'"
          class="autocomplete autocomplete__input"
          :search="searchFor"
          @submit="pushToNewSynonymSet"
        >
        </autocomplete>
        <result-list
          :resultId="'input-result'"
          :wordList="newSynonymSet"
          @remove="removeWord($event)"
        />
        <a
          @click="addSynonyms"
          class="button"
          :class="{ 'button--disabled': !canConfirm }"
          >Confirm</a
        >
      </div>
    </transition>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ResultList from "./ResultList.vue";

export default {
  name: "InputBar",
  components: {
    Autocomplete,
    ResultList,
  },
  data() {
    return {
      newSynonymSet: [],
      setString: "",
      showSuggestion: true,
      newWordInput: "",
      newWord: "",
    };
  },
  methods: {
    ...mapActions(["findWordsInList", "insertWord"]),
    ...mapMutations([
      "setShowInputBar",
      "addWordToSet",
      "createSet",
      "deleteSet",
      "updateWordkey",
      "setHasResult",
      "setSelectedSet",
    ]),
    searchFor(input) {
      const result = this.findWordsInList(input);
      if (!result.length) {
        this.showSuggestion = false;
        this.newWordInput = input;
      } else {
        this.showSuggestion = true;
      }
      return result;
    },
    pushToNewSynonymSet(result) {
      this.newWord = (result ? result : this.newWordInput).toLowerCase().trim();
      if (
        this.newWord.length >= 1 &&
        !this.newSynonymSet.includes(this.newWord) &&
        this.getCurrentWord != this.newWord &&
        !this.areSynonyms()
      ) {
        this.newSynonymSet.push(this.newWord);
      }
    },
    addSynonyms() {
      if (!this.canConfirm) {
        return;
      }
      if (this.getCurrentWord) {
        this.newSynonymSet.push(this.getCurrentWord);
      }
      const existingWords = [];
      this.newSynonymSet.forEach((word) => {
        if (this.getWordMap[word]) {
          existingWords.push(this.getWordMap[word]);
        }
      });
      if (existingWords.length < 1) {
        const setKey = this.$uuid.v4();
        this.createSet({ setKey });
        this.newSynonymSet.forEach((word) => {
          this.insertWord({ word, setKey });
          this.addWordToSet({ word, setKey });
        });
      } else if (existingWords.length === 1) {
        const setKey = existingWords[0].setKey;

        this.newSynonymSet.forEach((word) => {
          if (word === existingWords[0].value) {
            return;
          }
          this.insertWord({ word, setKey });
          this.addWordToSet({ word, setKey });
        });
      } else if (existingWords.length > 1) {
        const setKeys = new Set(existingWords.map(({ setKey }) => setKey));
        const setKey = this.$uuid.v4();
        let union = new Set();

        setKeys.forEach((key) => {
          union = this.union(union, this.getSets[key], setKey);
          this.deleteSet(key);
        });
        this.createSet({ setKey, set: union });

        this.newSynonymSet.forEach((word) => {
          if (
            existingWords.some((existingWord) => existingWord.value === word)
          ) {
            return;
          }
          this.insertWord({ word, setKey });
          this.addWordToSet({ word, setKey });
        });
      }
      this.newSynonymSet = [];

      if (this.getCurrentWord) {
        this.setHasResult(true);
        this.setSelectedSet(
          this.getSets[this.getWordMap[this.getCurrentWord].setKey]
        );
      }
    },
    union(setA, setB, setKey) {
      let union = new Set(setA);
      for (let word of setB) {
        this.updateWordkey({ word, setKey });
        union.add(word);
      }
      return union;
    },
    areSynonyms() {
      return (
        this.getCurrentWord &&
        !!this.getWordMap[this.getCurrentWord] &&
        !!this.getSets[this.getWordMap[this.getCurrentWord].setKey].has(
          this.newWord
        )
      );
    },
    removeWord(word) {
      this.newSynonymSet.splice(this.newSynonymSet.indexOf(word), 1);
    },
  },
  computed: {
    ...mapGetters([
      "getWordMap",
      "getSets",
      "getShowInputBar",
      "getCurrentWord",
    ]),
    canConfirm() {
      return (
        (this.newSynonymSet.length && this.getCurrentWord) ||
        this.newSynonymSet.length > 1
      );
    },
    arrowClass() {
      return this.getShowInputBar ? "arrow arrow--up" : "arrow arrow--down";
    },
    titleLabel() {
      return this.getCurrentWord
        ? `Add synonym to "${this.getCurrentWord}"`
        : "Add new set of synonyms";
    },
  },
  watch: {
    getCurrentWord() {
      this.newSynonymSet = [];
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/constants.scss";
.input-bar {
  text-align: center;
}
.arrow {
  transition: all 100ms ease;
  display: inline-block;
  width: 0;
  height: 0;
  color: map-get($colors, secondary);
  &--up {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 10px solid map-get($colors, secondary);
  }
  &--down {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-top: 10px solid map-get($colors, secondary);
  }
}
.button {
  display: inline-block;
  padding: 0.3rem 1.2rem;
  margin: 1rem 0.3rem 0.3rem 0;
  border-radius: 2rem;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: 300;
  color: map-get($colors, light);
  background-color: map-get($colors, secondary);
  text-align: center;
  transition: all 0.2s;
  &:hover {
    background-color: map-get($colors, primary);
  }
  &:active {
    box-shadow: inset 0 0.6rem 2rem -0.3rem rgba(0, 0, 0, 0.15),
      inset 0 0 0rem 0.05rem rgba(255, 255, 255, 0.12);
  }
  &--disabled {
    opacity: 0.4;
    cursor: default !important;
    pointer-events: none;
  }
}
</style>
