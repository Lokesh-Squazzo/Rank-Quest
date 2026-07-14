import { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'
import { Toast, ToastClose, ToastDescription, ToastTitle } from './ui/toast'

const ToastContext = createContext()

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const { toasts, toast, dismiss, dismissAll } = useToast()

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map((toastItem) => (
          <Toast key={toastItem.id} variant={toastItem.variant}>
            <div className="grid gap-1">
              {toastItem.title && <ToastTitle>{toastItem.title}</ToastTitle>}
              {toastItem.description && <ToastDescription>{toastItem.description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => dismiss(toastItem.id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
