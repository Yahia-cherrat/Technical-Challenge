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
    }),
    actions: {
        async fetchEmployees() {
            const response = await axios.get<Employee[]>('/api/employees')
            this.employees = response.data
        },
        async addEmployee(employee: Omit<Employee, 'id'>) {
            const response = await axios.post<Employee>('/api/employees', employee)
            this.employees.push(response.data)
        },
        async updateEmployee(id: number, employee: Omit<Employee, 'id'>) {
            await axios.put(`/api/employees/${id}`, employee)
            await this.fetchEmployees()
        },
        async deleteEmployee(id: number) {
            await axios.delete(`/api/employees/${id}`)
            this.employees = this.employees.filter(e => e.id !== id)
        },
    },
})
