import { useApp } from '../context.jsx'

export default function Toast() {
  const { toast } = useApp()
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast glass">
          {toast.msg}
        </div>
      )}
    </div>
  )
}
