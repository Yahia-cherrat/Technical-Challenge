<template>
    <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contract Articles</h2>

        <!-- Articles List with Checkboxes -->
        <ul v-if="articles.length > 0" class="space-y-4 mb-6">
            <li v-for="article in articles" :key="article.id" class="p-4 border border-gray-200 rounded-md flex items-start">
                <input
                    type="checkbox"
                    :value="article.id"
                    v-model="selectedContracts"
                    class="mr-2"
                />
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ article.title }}</h3>
                    <p class="text-gray-700">{{ article.content }}</p>
                </div>
                <div class="ml-auto mt-2 space-x-2">
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

        <!-- Download Selected Contracts Button -->
        <button
            v-if="selectedContracts.length > 0"
            @click="openEmployeeModal"
            class="w-full px-4 py-2 mb-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
            Download Selected Contracts
        </button>

        <!-- Employee Info Modal -->
        <div v-if="showEmployeeModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 class="text-xl font-semibold mb-4">Employee Information</h3>
                <form @submit.prevent="downloadContractsWithEmployeeInfo">
                    <input
                        v-model="employeeInfo.name"
                        placeholder="Employee Name"
                        class="w-full mb-4 px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        v-model="employeeInfo.position"
                        placeholder="Position"
                        class="w-full mb-4 px-3 py-2 border rounded-md"
                        required
                    />
                    <div class="flex justify-end space-x-2">
                        <button
                            type="button"
                            @click="closeEmployeeModal"
                            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>

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
import { useContractArticleStore } from '../store/contractArticles'
import { jsPDF } from 'jspdf'

export default defineComponent({
    setup() {
        const store = useContractArticleStore()
        const articles = computed(() => store.articles)
        const formArticle = ref({ title: '', content: '' })
        const isEditing = ref(false)
        const editArticleId = ref<number | null>(null)

        const selectedContracts = ref<number[]>([])
        const showEmployeeModal = ref(false)
        const employeeInfo = ref({ name: '', position: '' })

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

        const openEmployeeModal = () => {
            showEmployeeModal.value = true
        }

        const closeEmployeeModal = () => {
            showEmployeeModal.value = false
        }

        const downloadContractsWithEmployeeInfo = () => {
            selectedContracts.value.forEach((id) => {
                const article = articles.value.find((a) => a.id === id)
                if (article) {
                    const doc = new jsPDF()

                    // Set Title for Contract Page
                    doc.setFontSize(16)
                    doc.text("Contract", 105, 20, { align: "center" })

                    // Employee Information Section
                    doc.setFontSize(12)
                    doc.text("Employee Information", 10, 40)
                    doc.setFontSize(10)
                    doc.text(`Name: ${employeeInfo.value.name}`, 10, 50)
                    doc.text(`Position: ${employeeInfo.value.position}`, 10, 60)

                    // Content of the Contract Body
                    doc.setFontSize(12)
                    doc.text("Content:", 10, 100)
                    doc.setFontSize(10)
                    let contentY = 110
                    const lineHeight = 7

                    // Split text into lines that fit within the page width, starting at contentY
                    const lines = doc.splitTextToSize(article.content, 180)
                    lines.forEach((line) => {
                        if (contentY > 280) {
                            doc.addPage() // Add new page if content exceeds page limit
                            contentY = 20
                        }
                        doc.text(line, 10, contentY)
                        contentY += lineHeight
                    })

                    // Save PDF with title as filename
                    const sanitizedTitle = article.title.replace(/\s+/g, '_')
                    doc.save(`contract_${sanitizedTitle}.pdf`)
                }
            })
            closeEmployeeModal()
        }

        return {
            articles,
            formArticle,
            isEditing,
            handleFormSubmit,
            deleteArticle,
            selectArticleForEdit,
            selectedContracts,
            showEmployeeModal,
            openEmployeeModal,
            closeEmployeeModal,
            employeeInfo,
            downloadContractsWithEmployeeInfo,
        }
    },
})
</script>
