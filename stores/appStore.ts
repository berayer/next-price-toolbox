import { create } from 'zustand'

type State = {
  title: string[]
}

type Action = {
  setTitle: (title: string[]) => void
}

export const useAppStore = create<State & Action>((set) => ({
  title: [],
  setTitle: (title: string[]) => set(() => ({ title })),
}))
