---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "学生たちの技術ブログ"
  # text: "学生たちが様々な技術について語っているブログです"
  tagline: 学生たちが様々な技術について語っているブログです
  actions:
    - theme: brand
      text: 記事一覧
      link: /post/
---

<script setup>
import { data as posts } from './post/posts.data.js'
import HomeComponent from "./HomeComponent.vue"

const sorted_posts = posts
  .sort((a,b) => 
    new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  )
  .slice(0,5);
</script>

<HomeComponent>
<h1>最近の記事</h1>

<div v-for="p in sorted_posts">
    <a :href="p.url"><h2>{{p.frontmatter.title}}</h2></a>
    {{p.frontmatter.description}}
    <p>投稿日: {{ new Date(p.frontmatter.date).toLocaleDateString("ja-JP") }} <a :href="p.url">Read more</a></p>
</div>
</HomeComponent>
