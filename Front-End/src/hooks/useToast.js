import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, description, variant, duration }
    
    setToasts(prev => [...prev, newToast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  }
}
