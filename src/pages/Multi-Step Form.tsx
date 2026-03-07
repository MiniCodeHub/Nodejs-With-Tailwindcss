import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1 - Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2 - Address
  street: string;
  city: string;
  state: string;
  zip: string;
  // Step 3 - Account
  username: string;
  password: string;
  confirm: string;
  // Step 4 - Preferences
  newsletter: boolean;
  plan: "free" | "pro" | "enterprise";
  notifications: boolean;
}

interface FieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────
const STEPS = ["Personal", "Address", "Account", "Preferences", "Review"];

const PLANS = [
  { value: "free",       label: "Free",       price: "$0/mo",   desc: "Up to 3 projects" },
  { value: "pro",        label: "Pro",         price: "$19/mo",  desc: "Unlimited projects" },
  { value: "enterprise", label: "Enterprise",  price: "Custom",  desc: "Dedicated support" },
];

const INITIAL: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", city: "", state: "", zip: "",
  username: "", password: "", confirm: "",
  newsletter: false, plan: "free", notifications: true,
};

// ── Sub-components ─────────────────────────────────────────────────────────
function Field({ label, name, type = "text", placeholder, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-2.5 rounded-xl border text-sm outline-none transition
          focus:ring-2 focus:ring-indigo-300
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-indigo-400"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${i < current  ? "bg-indigo-600 text-white"
                : i === current ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                :                 "bg-gray-100 text-gray-400"}`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium hidden sm:block
              ${i === current ? "text-indigo-600" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`w-12 h-0.5 mx-1 mb-4 transition-all duration-500
              ${i < current ? "bg-indigo-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState<number>(0);
  const [data, setData]       = useState<FormData>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData(d => ({ ...d, [name]: type === "checkbox" ? checked : value }));
    setErrors(err => ({ ...err, [name]: "" }));
  };

  // ── Validation per step ──
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "First name is required.";
      if (!data.lastName.trim())  e.lastName  = "Last name is required.";
      if (!data.email.includes("@")) e.email  = "Enter a valid email.";
      if (data.phone && !/^\d{7,15}$/.test(data.phone.replace(/\s|-/g, "")))
        e.phone = "Enter a valid phone number.";
    }

    if (step === 1) {
      if (!data.street.trim()) e.street = "Street is required.";
      if (!data.city.trim())   e.city   = "City is required.";
      if (!data.state.trim())  e.state  = "State is required.";
      if (!data.zip.trim())    e.zip    = "ZIP code is required.";
    }

    if (step === 2) {
      if (data.username.length < 3) e.username = "Username must be at least 3 characters.";
      if (data.password.length < 6) e.password = "Password must be at least 6 characters.";
      if (data.password !== data.confirm) e.confirm = "Passwords do not match.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));
  const submit = () => { setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all set!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Welcome aboard, <strong>{data.firstName}</strong>! Your <strong>{data.plan}</strong> account is ready.
          </p>
          <button
            onClick={() => { setStep(0); setData(INITIAL); setSubmitted(false); }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-xl">

        <StepIndicator current={step} total={STEPS.length} />

        {/* ── Step 1: Personal ── */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Personal Details</h2>
            <p className="text-sm text-gray-500 mb-4">Tell us a little about yourself.</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" name="firstName" placeholder="Jane" value={data.firstName} onChange={update} error={errors.firstName} />
              <Field label="Last Name"  name="lastName"  placeholder="Doe"  value={data.lastName}  onChange={update} error={errors.lastName} />
            </div>
            <Field label="Email" name="email" type="email" placeholder="jane@example.com" value={data.email} onChange={update} error={errors.email} />
            <Field label="Phone (optional)" name="phone" type="tel" placeholder="+1 555 000 0000" value={data.phone} onChange={update} error={errors.phone} />
          </div>
        )}

        {/* ── Step 2: Address ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Your Address</h2>
            <p className="text-sm text-gray-500 mb-4">Where should we ship to?</p>
            <Field label="Street Address" name="street" placeholder="123 Main St" value={data.street} onChange={update} error={errors.street} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City"     name="city"  placeholder="New York"  value={data.city}  onChange={update} error={errors.city}  />
              <Field label="State"    name="state" placeholder="NY"        value={data.state} onChange={update} error={errors.state} />
            </div>
            <Field label="ZIP Code" name="zip" placeholder="10001" value={data.zip} onChange={update} error={errors.zip} />
          </div>
        )}

        {/* ── Step 3: Account ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 mb-4">Secure your new account.</p>
            <Field label="Username" name="username" placeholder="jane_doe" value={data.username} onChange={update} error={errors.username} />
            <Field label="Password" name="password" type="password" placeholder="Min 6 characters" value={data.password} onChange={update} error={errors.password} />
            <Field label="Confirm Password" name="confirm" type="password" placeholder="Repeat password" value={data.confirm} onChange={update} error={errors.confirm} />
          </div>
        )}

        {/* ── Step 4: Preferences ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Preferences</h2>
            <p className="text-sm text-gray-500 mb-4">Customise your experience.</p>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Choose a Plan</p>
              <div className="grid grid-cols-1 gap-3">
                {PLANS.map(plan => (
                  <label
                    key={plan.value}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition
                      ${data.plan === plan.value ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{plan.label}</p>
                      <p className="text-xs text-gray-500">{plan.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-indigo-600">{plan.price}</span>
                      <input
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={data.plan === plan.value}
                        onChange={update}
                        className="accent-indigo-600"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "newsletter",     label: "Subscribe to newsletter",      key: "newsletter"    as keyof FormData },
                { name: "notifications",  label: "Enable email notifications",   key: "notifications" as keyof FormData },
              ].map(item => (
                <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={data[item.key] as boolean}
                    onChange={update}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Review ── */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Review & Submit</h2>
            <p className="text-sm text-gray-500 mb-4">Double-check everything before submitting.</p>

            {[
              {
                title: "Personal",
                rows: [
                  ["Name",  `${data.firstName} ${data.lastName}`],
                  ["Email", data.email],
                  ["Phone", data.phone || "—"],
                ],
              },
              {
                title: "Address",
                rows: [
                  ["Street", data.street],
                  ["City",   `${data.city}, ${data.state} ${data.zip}`],
                ],
              },
              {
                title: "Account",
                rows: [
                  ["Username", data.username],
                  ["Password", "••••••••"],
                ],
              },
              {
                title: "Preferences",
                rows: [
                  ["Plan",          data.plan.charAt(0).toUpperCase() + data.plan.slice(1)],
                  ["Newsletter",    data.newsletter ? "Yes" : "No"],
                  ["Notifications", data.notifications ? "Yes" : "No"],
                ],
              },
            ].map(section => (
              <div key={section.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">{section.title}</p>
                <div className="space-y-1">
                  {section.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-800 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex justify-between mt-8">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200
              text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold
                hover:bg-indigo-700 active:scale-95 transition"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold
                hover:bg-emerald-700 active:scale-95 transition"
            >
              Submit
            </button>
          )}
        </div>

        {/* Progress text */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}