<template>
  <div class="results" id="selected-set">
    <transition name="slide-fade">
      <h3 v-if="getHasResult && getCurrentWord">
        No synonyms found for "{{ getCurrentWord }}", would you like to add
        some?
      </h3>
    </transition>
    <div v-if="getSelectedSet.size" class="results--list">
      <h3>"{{ getCurrentWord }}" is synonymous with</h3>
      <li class="results--item" v-for="word in displaySet" :key="word">
        {{ word }}
      </li>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResultList",
  computed: {
    displaySet() {
      if (this.getSize) {
        return Array.from(this.getSelectedSet).filter(
          (word) => word !== this.getCurrentWord
        );
      }
      return [];
    },
    ...mapGetters([
      "getSelectedSet",
      "getCurrentWord",
      "getHasResult",
      "getSize",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.results {
  text-align: center;
  margin-bottom: 1rem;
  &--list {
    display: inline-block;
  }
  &--item {
    text-align: left;
  }
}
</style>
