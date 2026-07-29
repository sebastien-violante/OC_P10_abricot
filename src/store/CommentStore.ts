import { create } from 'zustand'
import type { Comment } from '@/types/types'

type CommentStore = {
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  addComment: (comment: Comment) => void
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],

  setComments: (comments) => set({ comments }),

  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),
}))