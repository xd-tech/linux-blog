// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import "./style.css";
import AuthorInfo from "./AuthorInfo.vue";

export default {
  extends: Theme,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  Layout() {
    return h(Theme.Layout, null, {
      "doc-after": () => h(AuthorInfo),
    });
  },
};
