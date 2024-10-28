import { defineStore } from 'pinia'
import axios from 'axios'

export interface Employee {
    id: number
    name: string
    position: string
}

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employees: [] as Employee[],
        error: null as string | null,
    }),
    actions: {
        async fetchEmployees() {
            try {
                const response = await axios.get<Employee[]>('/api/employees')
                this.employees = response.data
            } catch (error) {
                console.error('Error fetching employees:', error)
                this.error = 'Failed to load employees.'
            }
        },
        async addEmployee(employee: Omit<Employee, 'id'>) {
            try {
                const response = await axios.post<Employee>('/api/employees', employee)
                this.employees.push(response.data)
            } catch (error) {
                console.error('Error adding employee:', error)
                this.error = 'Failed to add employee.'
            }
        },
        async updateEmployee(id: number, employee: Omit<Employee, 'id'>) {
            try {
                await axios.put(`/api/employees/${id}`, employee)
                await this.fetchEmployees()
            } catch (error) {
                console.error('Error updating employee:', error)
                this.error = 'Failed to update employee.'
            }
        },
        async deleteEmployee(id: number) {
            try {
                await axios.delete(`/api/employees/${id}`)
                this.employees = this.employees.filter(e => e.id !== id)
            } catch (error) {
                console.error('Error deleting employee:', error)
                this.error = 'Failed to delete employee.'
            }
        },
    },
})
