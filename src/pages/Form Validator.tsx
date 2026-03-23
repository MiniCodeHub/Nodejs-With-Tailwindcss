import { useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type ValidationState = "idle" | "valid" | "invalid";

interface FieldState {
  value: string;
  touched: boolean;
  state: ValidationState;
  message: string;
}

interface FormFields {
  firstName:  FieldState;
  lastName:   FieldState;
  email:      FieldState;
  username:   FieldState;
  password:   FieldState;
  confirm:    FieldState;
  phone:      FieldState;
  website:    FieldState;
}

type FieldName = keyof FormFields;

// ── Validators ─────────────────────────────────────────────────────────────
const validators: Record<FieldName, (value: string, fields?: FormFields) => string> = {
  firstName: v => {
    if (!v.trim())            return "First name is required.";
    if (v.trim().length < 2)  return "Must be at least 2 characters.";
    if (!/^[a-zA-Z\s'-]+$/.test(v)) return "Only letters, spaces, hyphens and apostrophes allowed.";
    return "";
  },
  lastName: v => {
    if (!v.trim())            return "Last name is required.";
    if (v.trim().length < 2)  return "Must be at least 2 characters.";
    return "";
  },
  email: v => {
    if (!v.trim())             return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address.";
    return "";
  },
  username: v => {
    if (!v.trim())            return "Username is required.";
    if (v.length < 3)         return "Must be at least 3 characters.";
    if (v.length > 20)        return "Must be 20 characters or fewer.";
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return "Only letters, numbers and underscores allowed.";
    if (/^\d/.test(v))        return "Cannot start with a number.";
    return "";
  },
  password: v => {
    if (!v)                   return "Password is required.";
    if (v.length < 8)         return "Must be at least 8 characters.";
    if (!/[A-Z]/.test(v))     return "Must contain at least one uppercase letter.";
    if (!/[0-9]/.test(v))     return "Must contain at least one number.";
    if (!/[^a-zA-Z0-9]/.test(v)) return "Must contain at least one special character.";
    return "";
  },
  confirm: (v, fields) => {
    if (!v)                   return "Please confirm your password.";
    if (v !== fields?.password.value) return "Passwords do not match.";
    return "";
  },
  phone: v => {
    if (!v.trim())            return ""; // optional
    const stripped = v.replace(/[\s\-().+]/g, "");
    if (!/^\d{7,15}$/.test(stripped)) return "Enter a valid phone number (7-15 digits).";
    return "";
  },
  website: v => {
    if (!v.trim())            return ""; // optional
    try { new URL(v.startsWith("http") ? v : "https://" + v); return ""; }
    catch { return "Enter a valid URL (e.g. example.com)."; }
  },
};

// ── Password strength ──────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (pw.length >= 12)              score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^a-zA-Z0-9]/.test(pw))      score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  return { score, label: labels[score] || "", color: colors[score] || "" };
}

// ── Field component ────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  name: FieldName;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  hint?: string;
  field: FieldState;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
}

function Field({ label, name, type = "text", placeholder, optional, hint, field, onChange, onBlur }: FieldProps) {
  const showFeedback = field.touched && field.state !== "idle";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {optional && <span className="ml-1 text-xs text-gray-400">(optional)</span>}
        </label>
        {showFeedback && field.state === "valid" && (
          <span className="text-xs font-semibold text-emerald-500">✓ Looks good</span>
        )}
      </div>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          value={field.value}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition pr-10
            focus:ring-2
            ${!field.touched || field.state === "idle"
              ? "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-indigo-200"
              : field.state === "valid"
              ? "border-emerald-400 bg-emerald-50 focus:ring-emerald-200"
              : "border-red-400 bg-red-50 focus:ring-red-200"}`}
        />
        {/* Icon */}
        {showFeedback && (
          <span className={`absolute right-3 top-3 text-sm
            ${field.state === "valid" ? "text-emerald-500" : "text-red-400"}`}>
            {field.state === "valid" ? "✓" : "✕"}
          </span>
        )}
      </div>
      {hint && !showFeedback && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {showFeedback && field.state === "invalid" && field.message && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {field.message}
        </p>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
const BLANK_FIELD: FieldState = { value: "", touched: false, state: "idle", message: "" };

function makeField(value = ""): FieldState {
  return { value, touched: false, state: "idle", message: "" };
}

const INITIAL_FORM: FormFields = {
  firstName: makeField(), lastName: makeField(), email:    makeField(),
  username:  makeField(), password: makeField(), confirm:  makeField(),
  phone:     makeField(), website:  makeField(),
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [fields, setFields]   = useState<FormFields>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);

  const validate = useCallback((name: FieldName, value: string, allFields: FormFields): FieldState => {
    const msg = validators[name](value, allFields);
    // optional fields with empty value = idle
    if ((name === "phone" || name === "website") && !value.trim()) {
      return { value, touched: true, state: "idle", message: "" };
    }
    return { value, touched: true, state: msg ? "invalid" : "valid", message: msg };
  }, []);

  const handleChange = (name: FieldName, value: string) => {
    setFields(prev => {
      const updated = { ...prev, [name]: { ...prev[name], value } };
      // Live validate once touched
      if (prev[name].touched) {
        updated[name] = validate(name, value, updated);
        // Re-validate confirm if password changes
        if (name === "password" && prev.confirm.touched) {
          updated.confirm = validate("confirm", updated.confirm.value, updated);
        }
      }
      return updated;
    });
  };

  const handleBlur = (name: FieldName) => {
    setFields(prev => {
      const updated = { ...prev };
      updated[name] = validate(name, prev[name].value, updated);
      return updated;
    });
  };

  const handleSubmit = () => {
    // Touch and validate all fields
    setFields(prev => {
      const updated = { ...prev };
      (Object.keys(updated) as FieldName[]).forEach(name => {
        updated[name] = validate(name, updated[name].value, updated);
      });
      return updated;
    });
    const allValid = (Object.keys(fields) as FieldName[]).every(name => {
      const msg = validators[name](fields[name].value, fields);
      if ((name === "phone" || name === "website") && !fields[name].value.trim()) return true;
      return !msg;
    });
    if (allValid) setSubmitted(true);
  };

  const strength = getStrength(fields.password.value);

  const validCount = (Object.keys(fields) as FieldName[]).filter(name => {
    if ((name === "phone" || name === "website") && !fields[name].value.trim()) return true;
    return fields[name].state === "valid";
  }).length;
  const progress = Math.round((validCount / 8) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
          <p className="text-gray-500 text-sm mb-6">Welcome, <strong>{fields.firstName.value}</strong>! Your account is ready.</p>
          <button onClick={() => { setFields(INITIAL_FORM); setSubmitted(false); }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-400 mt-0.5">All fields with inline real-time validation.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Form completion</span>
            <span className="font-semibold text-gray-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" name="firstName" placeholder="Jane"
              field={fields.firstName} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Last Name" name="lastName" placeholder="Doe"
              field={fields.lastName} onChange={handleChange} onBlur={handleBlur} />
          </div>

          <Field label="Email" name="email" type="email" placeholder="jane@example.com"
            field={fields.email} onChange={handleChange} onBlur={handleBlur} />

          <Field label="Username" name="username" placeholder="jane_doe"
            hint="3-20 chars. Letters, numbers and underscores only."
            field={fields.username} onChange={handleChange} onBlur={handleBlur} />

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} placeholder="Min 8 chars"
                value={fields.password.value}
                onChange={e => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition pr-20
                  focus:ring-2
                  ${!fields.password.touched || fields.password.state === "idle"
                    ? "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-indigo-200"
                    : fields.password.state === "valid"
                    ? "border-emerald-400 bg-emerald-50 focus:ring-emerald-200"
                    : "border-red-400 bg-red-50 focus:ring-red-200"}`}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-medium">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {/* Strength meter */}
            {fields.password.value && (
              <div className="mt-1">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.score ? strength.color : "#e5e7eb" }} />
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
            {fields.password.touched && fields.password.state === "invalid" && fields.password.message && (
              <p className="text-xs text-red-500">⚠ {fields.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input id="confirm" type={showCf ? "text" : "password"} placeholder="Repeat password"
                value={fields.confirm.value}
                onChange={e => handleChange("confirm", e.target.value)}
                onBlur={() => handleBlur("confirm")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition pr-20
                  focus:ring-2
                  ${!fields.confirm.touched || fields.confirm.state === "idle"
                    ? "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-indigo-200"
                    : fields.confirm.state === "valid"
                    ? "border-emerald-400 bg-emerald-50 focus:ring-emerald-200"
                    : "border-red-400 bg-red-50 focus:ring-red-200"}`}
              />
              <button type="button" onClick={() => setShowCf(v => !v)}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-medium">
                {showCf ? "Hide" : "Show"}
              </button>
            </div>
            {fields.confirm.touched && fields.confirm.state === "invalid" && (
              <p className="text-xs text-red-500">⚠ {fields.confirm.message}</p>
            )}
            {fields.confirm.touched && fields.confirm.state === "valid" && (
              <p className="text-xs text-emerald-500 font-semibold">✓ Passwords match</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" name="phone" type="tel" placeholder="+1 555 000 0000"
              optional field={fields.phone} onChange={handleChange} onBlur={handleBlur} />
            <Field label="Website" name="website" placeholder="example.com"
              optional field={fields.website} onChange={handleChange} onBlur={handleBlur} />
          </div>
        </div>

        <button onClick={handleSubmit}
          className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold
            hover:bg-indigo-700 active:scale-95 transition">
          Create Account
        </button>
      </div>
    </div>
  );
}