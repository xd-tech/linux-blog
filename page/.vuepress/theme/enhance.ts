import {defineClientAppEnhance} from "@vuepress/client"
import AuthorInfo from "./authorinfo/AuthorInfo.vue"

export default defineClientAppEnhance(({app,router,siteData})=>{
    app.component("AuthorInfo",AuthorInfo)
})