<template>
  <div class="results" id="selected-set">
    <transition name="slide-fade">
      <h3 v-if="showError">
        {{ errorMessage }}
      </h3>
    </transition>
    <div v-if="wordList.length" class="results--list">
      <h3 v-if="listTitle">{{ listTitle }}</h3>
      <div>
        <span class="input--list" id="new-set">
          <div class="input--item" v-for="word in wordList" :key="word">
            <span @click="removeWord(word)"
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
  &--list {
    display: inline-block;
    @media (min-width: #{map-get($breakpoints, mobile)}) {
      width: 45%;
    }
    overflow: hidden;
  }
  &--item {
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
