import { defineStore } from 'pinia'

interface Contact {
    name: string,
    email: string,
    message: string
}


export const useContactStore = defineStore('contactStore', () => {

    const contactMessage = (item: Contact) => {
        console.log("item")
        console.log(item)

    }

    return { contactMessage }
})