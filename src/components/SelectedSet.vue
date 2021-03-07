<template>
  <div class="results" id="selected-set">
    <div class="results--list">
      <h3>{{ getCurrentWord }} is synonymous with</h3>
      <li class="results--item" v-for="word in displaySet" :key="word">
        {{ word }}
      </li>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SelectedSet",

  props: {},
  data() {
    return {};
  },
  computed: {
    displaySet() {
      return Array.from(this.getSelectedSet).filter(
        (word) => word !== this.getCurrentWord
      );
    },
    ...mapGetters(["getSelectedSet", "getCurrentWord"]),
  },
};
</script>

<style lang="scss" scoped>
.results {
  text-align: center;
  &--list {
    display: inline-block;
  }
  &--item {
    text-align: left;
  }
}
</style>
