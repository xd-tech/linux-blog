<template>
    <div>
        <div v-if="categoryName">
            <h1>カテゴリ: <b>{{categoryName}}</b></h1>
            <div v-for="(post, index) in postsInCategory" :key="index">
                <h2>
                    <router-link :to="post.path">{{ post.frontmatter.title || post.title  }}</router-link>
                </h2>
                
                <p>{{ post.frontmatter.description }}</p>

                <p><router-link :to="post.path">Read more</router-link></p>
            </div>
        </div>
        <div v-else>
            <h1>カテゴリ一覧</h1>
            <ul>
                <li v-for="(c, index) in categories" :key="index">
                    <router-link :to="'#'+c">{{c}}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        categoryName(){
            return this.$route.hash.substr(1).toLowerCase()
        },
        postsInCategory () {
            return this.posts
                .filter(x => x.frontmatter.category !== undefined)
                .filter(x => x.frontmatter.category.toLocaleLowerCase() === this.categoryName)
        },
        posts() {
            return this.$site.pages
                .filter(x => x.path.startsWith('/post/') && !x.frontmatter.blog_index)
                .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
        },
        categories(){
            return this.$site.pages
                .filter(x => x.frontmatter.category !== undefined)
                .map(x => x.frontmatter.category)
                .reduce((a,x) => {
                    if (!a.includes(x))
                        a.push(x)
                        return a
                    },
                    []
                )
        }
    }
}
</script>
