import {defineClientAppEnhance} from "@vuepress/client"
import AuthorInfo from "./authorinfo/AuthorInfo.vue"

export default defineClientAppEnhance(({app})=>{
    // AuthorInfoコンポーネントをMarkdownやページ内で使えるようにする
    app.component("AuthorInfo",AuthorInfo)
})