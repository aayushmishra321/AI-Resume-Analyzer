import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

export function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-white border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] animate-in slide-in-from-bottom-5 z-50">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </div>
      <p className="text-sm text-foreground flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
