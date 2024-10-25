<template>
    <button
        class="text-white px-4 py-2 rounded"
        :class="bgColor"
        @click="handleButton"
    >
        {{ bgText }}
    </button>
</template>

<script setup >
    defineProps ({
        bgText: {
            type: String,
            required: true,
            default: 'Submit'
        },
        bgColor: String
    })
    
    const emits = defineEmits(['buttonClick'])
    const handleButton = () => {
        // console.log('button clicked')
        emits('buttonClick');
    }
</script>

<style scoped>
    .custom-button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>
