<template>
    <div class="employee-management">
        <h2 class="text-2xl font-semibold mb-4">Employee Management</h2>
        <form @submit.prevent="handleEmployeeSubmit" class="space-y-4">
            <input v-model="employee.name" placeholder="Employee Name" class="input" />
            <input v-model="employee.position" placeholder="Position" class="input" />
            <button type="submit" class="btn btn-primary">{{ isEditing ? "Update" : "Add" }} Employee</button>
        </form>

        <ul v-if="employees.length" class="employee-list">
            <li v-for="emp in employees" :key="emp.id">
                <span>{{ emp.name }} - {{ emp.position }}</span>
                <button @click="editEmployee(emp)">Edit</button>
                <button @click="deleteEmployee(emp.id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useEmployeeStore } from '@/store/employeeStore'

    const store = useEmployeeStore()
    const employee = ref({ name: '', position: '' })
    const isEditing = ref(false)
    const editEmployeeId = ref<number | null>(null)

    const handleEmployeeSubmit = async () => {
        if (isEditing.value && editEmployeeId.value !== null) {
            await store.updateEmployee(editEmployeeId.value, employee.value)
            isEditing.value = false
            editEmployeeId.value = null
        } else {
            await store.addEmployee(employee.value)
        }
        employee.value = { name: '', position: '' }
    }

    const editEmployee = (emp: { id: number, name: string, position: string }) => {
        isEditing.value = true
        editEmployeeId.value = emp.id
        employee.value = { name: emp.name, position: emp.position }
    }

    const deleteEmployee = async (id: number) => {
        await store.deleteEmployee(id)
    }
</script>
