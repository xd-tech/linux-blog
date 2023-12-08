---
blog_index: true
sidebar: false
---

<script setup>
import { data as posts } from './posts.data.js'

const sorted_posts = posts.sort((a,b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
</script>

# 記事一覧

<!-- -> [カテゴリから探す](/post/search/by-category.html)
-> [タグから探す](/post/search/by-tag.html) -->

<div v-for="p in sorted_posts">
    <a :href="p.url"><h2>{{p.frontmatter.title}}</h2></a>
    {{p.frontmatter.description}}
    <p>投稿日: {{ new Date(p.frontmatter.date).toLocaleDateString("ja-JP") }} <a :href="p.url">Read more</a></p>
</div>