<template>
  <div>
    <transition name="slide-fade">
      <h3 v-if="showError">
        {{ errorMessage }}
      </h3>
    </transition>
    <div v-if="wordList.length">
      <h3 id="result-title" v-if="listTitle">{{ listTitle }}</h3>
      <div>
        <span class="input__list" :id="resultId">
          <div class="input__item" v-for="word in wordList" :key="word">
            <span :id="`${resultId}-remove_${word}`" @click="removeWord(word)"
              ><img class="icon" :src="removeSymbolSrc"
            /></span>
            <span>{{ word }}</span>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResultList",
  props: {
    resultId: {
      type: String,
      default: "result-list",
    },
    wordList: {
      type: Array,
      default: () => [],
    },
    errorMessage: {
      type: String,
      default: "",
    },
    showError: {
      type: Boolean,
      default: false,
    },
    listTitle: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters([
      "getSelectedSet",
      "getCurrentWord",
      "getHasResult",
      "getSize",
    ]),
  },
  data() {
    return {
      removeSymbolSrc: require("../assets/icons/remove-symbol.svg"),
    };
  },
  methods: {
    removeWord(word) {
      this.$emit("remove", word);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/constants.scss";

.input {
  text-align: center;
  &__list {
    display: inline-block;
    @media (min-width: #{map-get($breakpoints, mobile)}) {
      width: 45%;
    }
    overflow: hidden;
  }
  &__item {
    margin-top: 0.3rem;
    text-align: left;
    display: flex;
  }
}
.icon {
  vertical-align: middle;
  margin-right: 0.3rem;
}
</style>
