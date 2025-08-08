"use no memo"

import { create } from "zustand"

interface ChatInputStore {
  message: string
  setMessage: (message: string) => void
  clearMessage: () => void
  isValid: () => boolean
}

export const useChatInputStore = create<ChatInputStore>()((set, get) => ({
  message: "",
  setMessage: (message) => set({ message }),
  clearMessage: () => set({ message: "" }),

  isValid: () => {
    const { message } = get()
    return message.trim().length > 0 && message.length <= 10000
  },
}))
