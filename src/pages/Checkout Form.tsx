import { useState, useMemo } from "react";

// -- Types ------------------------------------------------------------------
interface CartItem { id: number; name: string; price: number; qty: number; img: string; }

interface ShippingForm {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; zip: string; country: string;
}

interface PaymentForm {
  cardName: string; cardNumber: string; expiry: string; cvv: string;
}

type ShippingErrors  = Partial<Record<keyof ShippingForm, string>>;
type PaymentErrors   = Partial<Record<keyof PaymentForm, string>>;

// -- Seed data --------------------------------------------------------------
const CART: CartItem[] = [
  { id:1, name:"Wireless Headphones",  price:79.99,  qty:1, img:"" },
  { id:2, name:"Mechanical Keyboard",  price:109.99, qty:1, img:"" },
  { id:3, name:"USB-C Hub",            price:49.99,  qty:2, img:"" },
];

const SHIPPING_OPTIONS = [
  { id:"standard", label:"Standard",  days:"5-7 business days",  price:0    },
  { id:"express",  label:"Express",   days:"2-3 business days",  price:9.99 },
  { id:"overnight",label:"Overnight", days:"Next business day",  price:24.99},
];

const STEPS = ["Cart", "Shipping", "Payment", "Review", "Done"];

// -- Helpers ----------------------------------------------------------------
function formatCard(raw: string): string {
  return raw.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g,"").slice(0,4);
  return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d;
}

// -- Sub-components ---------------------------------------------------------
function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.slice(0,-1).map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
            transition-all duration-300
            ${i < step  ? "bg-indigo-600 text-white"
            : i === step ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
            :              "bg-gray-100 text-gray-400"}`}>
            {i < step ? "" : i + 1}
          </div>
          <span className={`hidden sm:block ml-2 text-xs font-medium
            ${i === step ? "text-indigo-600" : "text-gray-400"}`}>{s}</span>
          {i < STEPS.length - 2 && (
            <div className={`flex-1 h-0.5 mx-3 rounded transition-all duration-500
              ${i < step ? "bg-indigo-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface InputProps {
  label: string; value: string; placeholder?: string;
  type?: string; error?: string; half?: boolean;
  onChange: (v: string) => void;
}

function Input({ label, value, placeholder, type="text", error, half, onChange }: InputProps) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition
          focus:ring-2 focus:ring-indigo-200
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-indigo-400"}`} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// -- Main -------------------------------------------------------------------
export default function App() {
  const [step, setStep]         = useState(0);
  const [shipping, setShipping] = useState<ShippingForm>({
    firstName:"", lastName:"", email:"", phone:"",
    address:"", city:"", state:"", zip:"", country:"US",
  });
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [payment, setPayment]   = useState<PaymentForm>({ cardName:"", cardNumber:"", expiry:"", cvv:"" });
  const [paymentErrors, setPaymentErrors]   = useState<PaymentErrors>({});
  const [saveInfo, setSaveInfo] = useState(false);
  const [orderNum] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  const shippingCost = SHIPPING_OPTIONS.find(o => o.id === shippingMethod)!.price;
  const subtotal  = useMemo(() => CART.reduce((s, i) => s + i.price * i.qty, 0), []);
  const tax       = +(subtotal * 0.08).toFixed(2);
  const total     = +(subtotal + shippingCost + tax).toFixed(2);

  const upS = (field: keyof ShippingForm, val: string) => {
    setShipping(s => ({ ...s, [field]: val }));
    setShippingErrors(e => ({ ...e, [field]: undefined }));
  };
  const upP = (field: keyof PaymentForm, val: string) => {
    setPayment(p => ({ ...p, [field]: val }));
    setPaymentErrors(e => ({ ...e, [field]: undefined }));
  };

  // Validation
  const validateShipping = (): boolean => {
    const e: ShippingErrors = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim())  e.lastName  = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(shipping.email)) e.email = "Valid email required";
    if (!shipping.address.trim())   e.address   = "Required";
    if (!shipping.city.trim())      e.city      = "Required";
    if (!shipping.state.trim())     e.state     = "Required";
    if (!shipping.zip.trim())       e.zip       = "Required";
    setShippingErrors(e);
    return !Object.keys(e).length;
  };

  const validatePayment = (): boolean => {
    const e: PaymentErrors = {};
    if (!payment.cardName.trim()) e.cardName = "Required";
    if (payment.cardNumber.replace(/\s/g,"").length < 16) e.cardNumber = "Enter 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = "Use MM/YY format";
    if (payment.cvv.length < 3) e.cvv = "3 or 4 digits required";
    setPaymentErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2 && !validatePayment()) return;
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  // -- Step 0: Cart ----------------------------------------------------------
  const CartStep = (
    <div>
      <h2 className="font-bold text-gray-800 text-lg mb-4">Your Cart</h2>
      <div className="space-y-3 mb-6">
        {CART.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {item.img}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.qty}</p>
            </div>
            <span className="font-bold text-gray-800 text-sm">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 text-sm border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-emerald-500">Calculated next</span></div>
        <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
          <span>Estimated Total</span><span>${(subtotal + tax).toFixed(2)}+</span>
        </div>
      </div>
    </div>
  );

  // -- Step 1: Shipping ------------------------------------------------------
  const ShippingStep = (
    <div>
      <h2 className="font-bold text-gray-800 text-lg mb-4">Shipping Details</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Input label="First Name" value={shipping.firstName} placeholder="Jane"  half error={shippingErrors.firstName} onChange={v => upS("firstName", v)} />
        <Input label="Last Name"  value={shipping.lastName}  placeholder="Doe"   half error={shippingErrors.lastName}  onChange={v => upS("lastName",  v)} />
        <Input label="Email" type="email" value={shipping.email} placeholder="jane@example.com" error={shippingErrors.email} onChange={v => upS("email", v)} />
        <Input label="Phone (optional)" type="tel" value={shipping.phone} placeholder="+1 555 000 0000" onChange={v => upS("phone", v)} />
        <Input label="Street Address" value={shipping.address} placeholder="123 Main St" error={shippingErrors.address} onChange={v => upS("address", v)} />
        <Input label="City" value={shipping.city} placeholder="New York" half error={shippingErrors.city} onChange={v => upS("city", v)} />
        <Input label="State" value={shipping.state} placeholder="NY" half error={shippingErrors.state} onChange={v => upS("state", v)} />
        <Input label="ZIP Code" value={shipping.zip} placeholder="10001" half error={shippingErrors.zip} onChange={v => upS("zip", v)} />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipping Method</h3>
      <div className="space-y-2">
        {SHIPPING_OPTIONS.map(opt => (
          <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition
            ${shippingMethod === opt.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="shipping" value={opt.id} checked={shippingMethod === opt.id}
                onChange={() => setShippingMethod(opt.id)} className="accent-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.days}</p>
              </div>
            </div>
            <span className="font-semibold text-sm text-indigo-600">
              {opt.price === 0 ? "FREE" : `$${opt.price.toFixed(2)}`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // -- Step 2: Payment -------------------------------------------------------
  const PaymentStep = (
    <div>
      <h2 className="font-bold text-gray-800 text-lg mb-4">Payment Details</h2>
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <p className="text-xs text-white/60 mb-4">DEBIT / CREDIT CARD</p>
        <p className="font-mono text-lg tracking-widest mb-4">
          {payment.cardNumber || "   "}
        </p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/60">Card Holder</p>
            <p className="text-sm font-medium">{payment.cardName || "YOUR NAME"}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Expires</p>
            <p className="text-sm font-medium">{payment.expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name on Card" value={payment.cardName} placeholder="Jane Doe" error={paymentErrors.cardName} onChange={v => upP("cardName", v)} />
        <Input label="Card Number" value={payment.cardNumber} placeholder="1234 5678 9012 3456"
          error={paymentErrors.cardNumber}
          onChange={v => upP("cardNumber", formatCard(v))} />
        <Input label="Expiry" value={payment.expiry} placeholder="MM/YY" half
          error={paymentErrors.expiry}
          onChange={v => upP("expiry", formatExpiry(v))} />
        <Input label="CVV" value={payment.cvv} placeholder="" type="password" half
          error={paymentErrors.cvv}
          onChange={v => upP("cvv", v.replace(/\D/g,"").slice(0,4))} />
      </div>
      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} className="accent-indigo-600" />
        <span className="text-xs text-gray-500">Save payment info for future orders</span>
      </label>
      <div className="flex items-center gap-2 mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
        <span className="text-emerald-500"></span>
        <span className="text-xs text-emerald-700 font-medium">256-bit SSL encryption. Your data is secure.</span>
      </div>
    </div>
  );

  // -- Step 3: Review --------------------------------------------------------
  const ReviewStep = (
    <div>
      <h2 className="font-bold text-gray-800 text-lg mb-4">Review Order</h2>
      <div className="space-y-4">
        {[
          { title:"Items", content: CART.map(i => `${i.name} x${i.qty} -- $${(i.price*i.qty).toFixed(2)}`).join("\n") },
          { title:"Ship to", content: `${shipping.firstName} ${shipping.lastName}\n${shipping.address}\n${shipping.city}, ${shipping.state} ${shipping.zip}\n${shipping.email}` },
          { title:"Payment", content: `Card ending in ${payment.cardNumber.slice(-4) || "????"}` },
          { title:"Shipping", content: SHIPPING_OPTIONS.find(o => o.id === shippingMethod)!.label + " -- " + SHIPPING_OPTIONS.find(o => o.id === shippingMethod)!.days },
        ].map(section => (
          <div key={section.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">{section.title}</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
          </div>
        ))}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="flex justify-between text-gray-500"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // -- Step 4: Confirmation --------------------------------------------------
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-1">Order <span className="font-mono font-bold text-indigo-600">#{orderNum}</span></p>
          <p className="text-gray-400 text-xs mb-6">A confirmation has been sent to <strong>{shipping.email}</strong></p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            {CART.map(i => (
              <div key={i.id} className="flex justify-between text-sm text-gray-600 py-1">
                <span>{i.img} {i.name} x{i.qty}</span>
                <span className="font-medium">${(i.price*i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => { setStep(0); setShipping({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",state:"",zip:"",country:"US"}); setPayment({cardName:"",cardNumber:"",expiry:"",cvv:""}); }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-xl">
        <StepBar step={step} />
        {step === 0 && CartStep}
        {step === 1 && ShippingStep}
        {step === 2 && PaymentStep}
        {step === 3 && ReviewStep}
        <div className="flex justify-between mt-8">
          <button onClick={back} disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200
              text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed">
            Back
          </button>
          <button onClick={step === 3 ? () => setStep(4) : next}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition active:scale-95
              bg-indigo-600 text-white hover:bg-indigo-700">
            {step === 3 ? "Place Order" : "Continue"}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Step {step + 1} of {STEPS.length - 1}</p>
      </div>
    </div>
  );
}