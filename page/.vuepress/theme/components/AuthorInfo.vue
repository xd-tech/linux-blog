<template lang="html">
  <div>
    <div v-if="show" class="info-container">
      <img :src="info.pic" alt="profile picture" id="profileimg">
      <div class="info-texts">
        <div id="username">{{info.name}}</div>
        <div><span id="bio">{{info.bio}}</span></div>
        <div><a :href="info.infoPageUrl">more info</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorInfos from "../../authorinfo";

export default {
  computed: {
    show() {
      return (
        this.authorName !== undefined &&
        this.authors.includes(this.authorName.toLowerCase())
      );
    },
    authorName() {
      return this.$page.frontmatter.author;
    },
    authors() {
      return AuthorInfos.authors.map(x => x.username.toLowerCase());
    },
    info() {
      return AuthorInfos.authors.filter(
        x => x.username.toLowerCase() === this.authorName.toLowerCase()
      )[0];
    }
  }
};
</script>

<style lang="css" scoped>
.info-container {
  display: flex;
  align-items: center;
  margin: 20px;
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
