<!-- /.vuepress/components/BlogIndex.vue -->

<template>
  <div>
    <div v-for="post in posts">
      <h2>
        <router-link :to="post.path">{{ post.frontmatter.title || post.title }}</router-link>
      </h2>

      <p>{{ post.frontmatter.description }}</p>

      <p>
        <router-link :to="post.path">Read more</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$site.pages
        .filter(
          x => x.path.match(/^\/post\/[^\/]*\.html$/gi) && !x.frontmatter.blog_index
        )
        .sort(
          (a, b) => {
            let adate = a.frontmatter.date || "2019-1-1"
            let bdate = b.frontmatter.date || "2018-1-1"
            return new Date(bdate) - new Date(adate)
          }
        )
        .slice(0,5);
    }
  }
};
</script>
