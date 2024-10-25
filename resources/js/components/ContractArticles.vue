<template>
    <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contract Articles</h2>

        <!-- Articles List -->
        <ul v-if="articles.length > 0" class="space-y-4 mb-6">
            <li v-for="article in articles" :key="article.id" class="p-4 border border-gray-200 rounded-md">
                <h3 class="text-lg font-semibold text-gray-900">{{ article.title }}</h3>
                <p class="text-gray-700">{{ article.content }}</p>
                <div class="mt-2 space-x-2">
                    <button
                        @click="deleteArticle(article.id)"
                        class="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        @click="selectArticleForEdit(article)"
                        class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                </div>
            </li>
        </ul>
        <p v-else class="my-3">No Article Added Yet!</p>

        <!-- Article Form -->
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
            <input
                v-model="formArticle.title"
                placeholder="Title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <textarea
                v-model="formArticle.content"
                placeholder="Content"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            ></textarea>
            <button
                type="submit"
                class="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
            >
                {{ isEditing ? "Update" : "Add" }} Article
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useContractArticleStore } from '@/store/contractArticles'

export default defineComponent({
    setup() {
        const store = useContractArticleStore()
        const articles = computed(() => store.articles)
        const formArticle = ref({ title: '', content: '' })
        const isEditing = ref(false)
        const editArticleId = ref<number | null>(null)

        onMounted(() => {
            store.fetchArticles()
        })

        const handleFormSubmit = async () => {
            if (isEditing.value && editArticleId.value !== null) {
                await store.updateArticle(editArticleId.value, formArticle.value)
                isEditing.value = false
                editArticleId.value = null
            } else {
                await store.addArticle(formArticle.value)
            }
            formArticle.value = { title: '', content: '' }
        }

        const deleteArticle = async (id: number) => {
            await store.deleteArticle(id)
        }

        const selectArticleForEdit = (article: { id: number, title: string, content: string }) => {
            isEditing.value = true
            editArticleId.value = article.id
            formArticle.value = { title: article.title, content: article.content }
        }

        return {
            articles,
            formArticle,
            isEditing,
            handleFormSubmit,
            deleteArticle,
            selectArticleForEdit,
        }
    },
})
</script>
