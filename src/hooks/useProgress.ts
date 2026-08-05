import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'container-lab-progress-v1'

function readProgress(): string[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useProgress(totalLessons: number) {
  const [completed, setCompleted] = useState<string[]>(readProgress)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const toggleCompleted = (lessonId: string) => {
    setCompleted((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId],
    )
  }

  const percentage = useMemo(
    () => Math.round((completed.length / totalLessons) * 100),
    [completed.length, totalLessons],
  )

  return { completed, toggleCompleted, percentage }
}
