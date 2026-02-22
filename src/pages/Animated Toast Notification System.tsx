import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastConfig {
  bg: string;
  border: string;
  icon: string;
  iconBg: string;
  bar: string;
  label: string;
  labelColor: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const TOAST_TYPES: Record<ToastType, ToastConfig> = {
  success: {
    bg: "bg-emerald-950",
    border: "border-emerald-500/40",
    icon: "✓",
    iconBg: "bg-emerald-500",
    bar: "bg-emerald-500",
    label: "Success",
    labelColor: "text-emerald-400",
  },
  error: {
    bg: "bg-red-950",
    border: "border-red-500/40",
    icon: "✕",
    iconBg: "bg-red-500",
    bar: "bg-red-500",
    label: "Error",
    labelColor: "text-red-400",
  },
  warning: {
    bg: "bg-amber-950",
    border: "border-amber-500/40",
    icon: "!",
    iconBg: "bg-amber-500",
    bar: "bg-amber-500",
    label: "Warning",
    labelColor: "text-amber-400",
  },
  info: {
    bg: "bg-sky-950",
    border: "border-sky-500/40",
    icon: "i",
    iconBg: "bg-sky-500",
    bar: "bg-sky-500",
    label: "Info",
    labelColor: "text-sky-400",
  },
};

const DURATION = 4000;

const DEMO_MESSAGES: Record<ToastType, string[]> = {
  success: [
    "Your changes have been saved successfully.",
    "Payment processed! Receipt sent to your email.",
    "Profile updated. Looking good!",
  ],
  error: [
    "Connection failed. Please check your network.",
    "Upload failed — file too large (max 10MB).",
    "Authentication error. Please log in again.",
  ],
  warning: [
    "Your session will expire in 5 minutes.",
    "Disk usage at 87%. Consider cleaning up.",
    "Unsaved changes detected. Review before leaving.",
  ],
  info: [
    "New version available. Refresh to update.",
    "Scheduled maintenance tonight at 2:00 AM.",
    "You have 3 unread notifications.",
  ],
};

// ─── Custom Hook: useToast ────────────────────────────────────────────────────

let idCounter = 0;

function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const add = useCallback((type: ToastType, message: string): void => {
    setToasts((prev) => [...prev, { id: ++idCounter, type, message }]);
  }, []);

  const remove = useCallback((id: number): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const trigger = useCallback(
    (type: ToastType): void => {
      const msgs = DEMO_MESSAGES[type];
      const message = msgs[Math.floor(Math.random() * msgs.length)];
      add(type, message);
    },
    [add]
  );

  return { toasts, add, remove, trigger };
}

// ─── Toast Component ──────────────────────────────────────────────────────────

interface ToastProps {
  toast: ToastData;
  onRemove: (id: number) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [leaving, setLeaving] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cfg: ToastConfig = TOAST_TYPES[toast.type];

  const dismiss = useCallback((): void => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 400);
  }, [leaving, onRemove, toast.id]);

  useEffect(() => {
    // Slide in on next paint
    const raf = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after DURATION
    timerRef.current = setTimeout(dismiss, DURATION);

    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform:
          visible && !leaving
            ? "translateX(0) scale(1)"
            : "translateX(110%) scale(0.9)",
        opacity: visible && !leaving ? 1 : 0,
        marginBottom: leaving ? "-80px" : "0",
      }}
      className={`relative w-80 rounded-xl border ${cfg.bg} ${cfg.border} overflow-hidden shadow-2xl`}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-0.5 w-full bg-white/10">
        <div
          className={`h-full ${cfg.bar} origin-left`}
          style={{ animation: `shrink ${DURATION}ms linear forwards` }}
        />
      </div>

      <div className="flex items-start gap-3 p-4 pt-5">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-lg ${cfg.iconBg} flex items-center justify-center font-bold text-white text-sm shadow-lg`}
        >
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-semibold tracking-widest uppercase mb-0.5 ${cfg.labelColor}`}
          >
            {cfg.label}
          </p>
          <p className="text-white/90 text-sm leading-snug font-light">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/10 transition-all text-xs mt-0.5 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: number) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 flex flex-col-reverse gap-3 z-50"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ─── Trigger Button ───────────────────────────────────────────────────────────

interface TriggerButtonProps {
  type: ToastType;
  cfg: ToastConfig;
  onClick: (type: ToastType) => void;
}

function TriggerButton({ type, cfg, onClick }: TriggerButtonProps) {
  return (
    <button
      onClick={() => onClick(type)}
      className={`group relative px-6 py-4 rounded-xl border ${cfg.border} ${cfg.bg} hover:brightness-125 transition-all duration-200 active:scale-95 cursor-pointer overflow-hidden`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-lg ${cfg.iconBg} flex items-center justify-center font-bold text-white text-sm shadow-lg group-hover:scale-110 transition-transform`}
        >
          {cfg.icon}
        </span>
        <div className="text-left">
          <p
            className={`text-xs font-semibold tracking-widest uppercase ${cfg.labelColor}`}
          >
            {cfg.label}
          </p>
          <p className="text-white/40 text-xs mt-0.5">Click to trigger</p>
        </div>
      </div>
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { toasts, remove, trigger } = useToast();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #0f1a2e 0%, #050a14 60%, #0a0510 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Center panel */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/50 text-xs tracking-widest uppercase font-medium">
              Live Preview
            </span>
          </div>
          <h1
            className="text-5xl font-bold text-white mb-3 tracking-tight"
            style={{ textShadow: "0 0 60px rgba(148,163,184,0.3)" }}
          >
            Toast System
          </h1>
          <p className="text-white/40 text-base font-light">
            useState · useEffect · Custom Hook · TypeScript
          </p>
        </div>

        {/* Trigger buttons */}
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(TOAST_TYPES) as [ToastType, ToastConfig][]).map(
            ([type, cfg]) => (
              <TriggerButton key={type} type={type} cfg={cfg} onClick={trigger} />
            )
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {toasts.length}
            </p>
            <p className="text-white/30 text-xs uppercase tracking-widest">
              Active
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-white">
              {DURATION / 1000}s
            </p>
            <p className="text-white/30 text-xs uppercase tracking-widest">
              Duration
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-2xl font-bold text-white">BR</p>
            <p className="text-white/30 text-xs uppercase tracking-widest">
              Position
            </p>
          </div>
        </div>

        {/* TypeScript badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <span className="text-blue-400 text-xs font-mono font-semibold">TS</span>
          <span className="text-white/40 text-xs">
            Fully typed · ToastType · ToastData · ToastConfig
          </span>
        </div>
      </div>

      {/* Toast portal */}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}