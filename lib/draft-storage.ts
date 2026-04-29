import { PokjaDraft } from "@/types/pokja"

const DRAFT_KEY = "pokjaDrafts"

export function getDrafts(): PokjaDraft | null {
  try {
    const data = sessionStorage.getItem(DRAFT_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveDraftToStorage(draft: PokjaDraft): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY)
}

export function createDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}