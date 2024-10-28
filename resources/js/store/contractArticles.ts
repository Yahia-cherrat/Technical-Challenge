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
        loading: false,    // Track loading state
        error: null as string | null // Track errors
    }),
    actions: {
        // Fetch Articles
        async fetchArticles() {
            this.loading = true
            this.error = null
            try {
                const response = await axios.get<Article[]>('/api/contract-articles')
                this.articles = response.data
            } catch (error) {
                this.error = 'Failed to fetch articles. Please try again later.'
                console.error('Error fetching articles:', error)
            } finally {
                this.loading = false
            }
        },

        // Add Article
        async addArticle(article: Omit<Article, 'id'>) {
            this.loading = true
            this.error = null
            try {
                const response = await axios.post<Article>('/api/contract-articles', article)
                this.articles.push(response.data)
            } catch (error) {
                this.error = 'Failed to add article. Please try again later.'
                console.error('Error adding article:', error)
            } finally {
                this.loading = false
            }
        },

        // Update Article
        async updateArticle(id: number, article: Omit<Article, 'id'>) {
            this.loading = true
            this.error = null
            try {
                await axios.put(`/api/contract-articles/${id}`, article)
                await this.fetchArticles()
            } catch (error) {
                this.error = 'Failed to update article. Please try again later.'
                console.error('Error updating article:', error)
            } finally {
                this.loading = false
            }
        },

        // Delete Article
        async deleteArticle(id: number) {
            this.loading = true
            this.error = null
            try {
                await axios.delete(`/api/contract-articles/${id}`)
                this.articles = this.articles.filter(a => a.id !== id)
            } catch (error) {
                this.error = 'Failed to delete article. Please try again later.'
                console.error('Error deleting article:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
