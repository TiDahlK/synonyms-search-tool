<template>
  <div id="app">
    <search-bar />
    <transition name="slide-fade">
      <selected-set v-if="getSelectedSet.size" />
    </transition>
    <input-bar />
  </div>
</template>

<script>
import InputBar from "./components/InputBar.vue";
import SearchBar from "./components/SearchBar.vue";
import { mapGetters } from "vuex";
import SelectedSet from "./components/SelectedSet.vue";

export default {
  name: "App",
  components: {
    InputBar,
    SearchBar,
    SelectedSet,
  },
  computed: {
    ...mapGetters(["getShowInputBar", "getSelectedSet"]),
  },
};
</script>

<style lang="scss">
@import "@/styles/constants.scss";

body {
  background-color: map-get($colors, background);
}
#app {
  font-family: Montserrat-Regular, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: map-get($colors, light);
  margin-top: 60px;
  @media (min-width: #{map-get($breakpoints, mobile)}) {
    position: absolute;
    top: 15%;
    bottom: 20px;
    width: 100%;
  }
}
.autocomplete {
  border-radius: 25px;
  color: map-get($colors, dark);
  position: relative;
  display: block;
  margin: 0 auto;

  &__search {
    @media (min-width: #{map-get($breakpoints, mobile)}) {
      width: 66%;
    }
  }
  &__input {
    @media (min-width: #{map-get($breakpoints, mobile)}) {
      width: 45%;
    }
  }
}
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
</style>
