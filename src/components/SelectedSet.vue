<template>
  <div class="results" id="selected-set">
    <h3>{{ getCurrentWord }} is synonymous with</h3>
    <div>
      <p v-for="word in displaySet" :key="word">
        {{ word }}
      </p>
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
}
</style>
