"use no memo"

import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PinnedSessionsStore {
  pinnedSessionIds: string[]
  pinSession: (sessionId: string) => void
  unpinSession: (sessionId: string) => void
  togglePin: (sessionId: string) => void
  isPinned: (sessionId: string) => boolean
  getPinnedSessionAtIndex: (index: number) => string | undefined
}

const MAX_PINNED_SESSIONS = 5

export const usePinnedSessionsStore = create<PinnedSessionsStore>()(
  persist(
    (set, get) => ({
      pinnedSessionIds: [],

      pinSession: (sessionId) => {
        const { pinnedSessionIds } = get()

        if (pinnedSessionIds.includes(sessionId)) return

        if (pinnedSessionIds.length >= MAX_PINNED_SESSIONS) {
          toast.error(`Maximum ${MAX_PINNED_SESSIONS} pinned sessions allowed`)
          return
        }

        set({ pinnedSessionIds: [...pinnedSessionIds, sessionId] })
      },

      unpinSession: (sessionId) => {
        const { pinnedSessionIds } = get()
        set({
          pinnedSessionIds: pinnedSessionIds.filter((id) => id !== sessionId),
        })
      },

      togglePin: (sessionId) => {
        const { isPinned, pinSession, unpinSession } = get()

        if (isPinned(sessionId)) {
          unpinSession(sessionId)
        } else {
          pinSession(sessionId)
        }
      },

      isPinned: (sessionId) => {
        const { pinnedSessionIds } = get()
        return pinnedSessionIds.includes(sessionId)
      },

      getPinnedSessionAtIndex: (index) => {
        const { pinnedSessionIds } = get()
        return pinnedSessionIds[index]
      },
    }),
    {
      name: "pinned-sessions",
      partialize: (state) => ({ pinnedSessionIds: state.pinnedSessionIds }),
    },
  ),
)
