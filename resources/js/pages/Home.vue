<template>
    <div>
        <div class="text-2xl">This is a home vue page</div>
        <div>
            <CustomButton
                :bgText="buttonText"
                bgColor="bg-[#4CAF50]"
                @buttonClick="handleButtonClick"
            />
        </div>
    </div>
</template>

<script setup>
    import CustomButton from '@/components/buttons/CustomButton.vue';
    import { ref } from 'vue';

    const buttonText = ref('delete');
    
    const fetchData = () => {
        console.log('fetched data');
    }
    const handleButtonClick = () => {
        // console.log('button clicked')
        fetchData();
    }
</script>
