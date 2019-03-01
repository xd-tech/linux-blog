<template>
  <div>
    <div v-if="tagName">
      <h1>
        タグ:
        <b>{{tagName}}</b>
      </h1>
      <div v-for="(post, index) in postsWithTag" :key="index">
        <h2>
          <router-link :to="post.path">{{ post.frontmatter.title || post.title }}</router-link>
        </h2>

        <p>{{ post.frontmatter.description }}</p>

        <p>
          <router-link :to="post.path">Read more</router-link>
        </p>
      </div>
    </div>
    <div v-else>
      <h1>タグ一覧</h1>
      <ul>
        <li v-for="(t, index) in tags" :key="index">
          <router-link :to="'#'+t">{{t}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    tagName() {
      return this.$route.hash.substr(1).toLowerCase();
    },
    postsWithTag() {
      return this.posts
        .filter(x => x.frontmatter.tag !== undefined)
        .filter(
          x => x.frontmatter.tag.some(v => v.toLowerCase() === this.tagName)
        );
    },
    posts() {
      return this.$site.pages
        .filter(x => x.path.startsWith("/post/") && !x.frontmatter.blog_index)
        .sort(
          (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
        );
    },
    tags() {
      return this.$site.pages
        .filter(x => x.frontmatter.tag !== undefined)
        .map(x => x.frontmatter.tag)
        .reduce((a, x) => a.concat(x), [])
        .reduce((a, x) => {
          if (!a.includes(x)) a.push(x);
          return a;
        }, [])
        .map(x => x.toLowerCase())
        .sort((a,b) => a > b);
    }
  }
};
</script>
