<template>
  <div class="input-bar" id="input">
    <div>
      <div v-if="!getShowInputBar"></div>
      <span :class="arrowClass" @click="setShowInputBar(!getShowInputBar)">
      </span>
      <div v-if="getShowInputBar"></div>
    </div>
    <transition name="slide-fade">
      <div v-if="getShowInputBar">
        <h3>Add new set of synonyms</h3>
        <autocomplete
          :id="'input-bar'"
          class="autocomplete autocomplete__input"
          :search="inputBar"
          :auto-select="true"
          @submit="pushToNewSynonymSet"
        >
        </autocomplete>
        <span id="new-set">
          <li v-for="word in newSynonymSet" :key="word">{{ word }}</li>
        </span>
        <button @click="addSynonyms">Add New Synonyms</button>
      </div>
    </transition>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "InputBar",
  components: {
    Autocomplete,
  },
  data() {
    return {
      newSynonymSet: [],
      setString: "",
      showSuggestion: true,
      newWordInput: "",
    };
  },
  methods: {
    ...mapActions(["search", "findWordsInwordList", "insertWord"]),
    ...mapMutations([
      "setShowInputBar",
      "setSelectedSet",
      "addWordToSet",
      "createSet",
      "deleteSet",
      "updateWordkey",
    ]),
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
    pushToNewSynonymSet(result) {
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
    },
    union(setA, setB, setKey) {
      let union = new Set(setA);
      for (let word of setB) {
        this.updateWordkey({ word, setKey });
        union.add(word);
      }
      return union;
    },
  },
  computed: {
    ...mapGetters(["getWordMap", "getSets", "getShowInputBar"]),
    canAddSet() {
      return this.newSynonymSet.length > 1;
    },
    arrowClass() {
      return this.getShowInputBar ? "arrow arrow--up" : "arrow arrow--down";
    },
  },
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.input-bar {
  text-align: center;
}
.arrow {
  transition: all 100ms ease;
  display: inline-block;
  width: 0;
  height: 0;
  color: #1e5f74;
  &--up {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 10px solid #1e5f74;
  }
  &--down {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-top: 10px solid #1e5f74;
  }
}
</style>
