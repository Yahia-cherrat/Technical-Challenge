import { defineStore } from 'pinia'
import axios from 'axios'

export interface Article {
    id: number
    title: string
    content: string
}

export const useContractArticleStore = defineStore('contractArticle', {
    state: () => ({
        articles: [] as Article[],
    }),
    actions: {
        async fetchArticles() {
            const response = await axios.get<Article[]>('/api/contract-articles')
            // console.log('Fetched articles:', response.data);
            this.articles = response.data
        },
        async addArticle(article: Omit<Article, 'id'>) {
            const response = await axios.post<Article>('/api/contract-articles', article)
            this.articles.push(response.data) // add new article to the store
        },
        async updateArticle(id: number, article: Omit<Article, 'id'>) {
            await axios.put(`/api/contract-articles/${id}`, article)
            await this.fetchArticles()
        },
        async deleteArticle(id: number) {
            await axios.delete(`/api/contract-articles/${id}`)
            this.articles = this.articles.filter((a) => a.id !== id)
        },
    },
})
