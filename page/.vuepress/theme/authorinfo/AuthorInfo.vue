<template>
  <div>
    <div v-if="show" class="info-container">
      <img :src="info?.pic" alt="profile picture" id="profileimg" />
      <div class="info-texts">
        <div id="username">{{ info?.name }}</div>
        <div>
          <span id="bio">{{ info?.bio }}</span>
        </div>
        <!-- <div><a :href="info?.infoPageUrl">more info</a></div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { authors } from "../authorinfo";
import { Author } from "../authorinfo/author";

import { defineComponent, ref } from "vue";
import { usePageFrontmatter } from "@vuepress/client";

export default defineComponent({
  computed: {
    // 著者情報を表示するか（ホームページや投稿一覧では表示しない）
    show(): boolean {
      return (
        this.authorName !== undefined &&
        this.author_names.includes(this.authorName.toLowerCase())
      );
    },
    // この記事の著者名
    authorName(): string {
      return this.frontmatter.author as string;
    },
    // すべての著者情報
    author_names(): string[] {
      return authors.map((x) => x.username.toLowerCase());
    },
    // 著者の情報
    info(): Author | undefined {
      return authors.find(
        (x: Author) => x.username.toLowerCase() === this.authorName.toLowerCase()
      );
    },
  },
  setup() {
    // Markdownの上に書いてあるyamlの部分の情報
    const frontmatter = usePageFrontmatter();

    return { frontmatter };
  },
});
</script>

<style lang="css" scoped>
.info-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
  background-color: rgba(200, 200, 200, 0.5);
  border-radius: 10px;
}

.info-texts {
  text-align: left;
  word-break: break-all;
  border: none;
  padding: 5px;
}

#profileimg {
  height: 5em;
  border-radius: 100%;
  padding: 10px;
}

#username {
  font-size: 1.2em;
  font-weight: 800;
}

#bio {
  color: rgba(0, 0, 0, 0.5);
}
</style>
