import { useState, useRef, useId } from "react";
import type { KeyboardEvent } from "react";

// -- Types ------------------------------------------------------------------
interface Tag { id: string; label: string; }
type Variant = "default" | "success" | "warning" | "error" | "info";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  maxTags?: number;
  variant?: Variant;
  suggestions?: string[];
  allowDuplicates?: boolean;
  delimiter?: string[];
  initialTags?: string[];
  readOnly?: boolean;
  onTagsChange?: (tags: string[]) => void;
}

// -- Helpers ----------------------------------------------------------------
function uid() { return Math.random().toString(36).slice(2, 9); }

const VARIANT_STYLES: Record<Variant, { chip: string; ring: string; dot: string }> = {
  default: { chip:"bg-indigo-500/15 text-indigo-300 border-indigo-500/25 hover:border-indigo-400",  ring:"focus-within:border-indigo-500 focus-within:ring-indigo-500/20", dot:"bg-indigo-400" },
  success: { chip:"bg-emerald-500/15 text-emerald-300 border-emerald-500/25 hover:border-emerald-400", ring:"focus-within:border-emerald-500 focus-within:ring-emerald-500/20", dot:"bg-emerald-400" },
  warning: { chip:"bg-amber-500/15 text-amber-300 border-amber-500/25 hover:border-amber-400",   ring:"focus-within:border-amber-500 focus-within:ring-amber-500/20",   dot:"bg-amber-400" },
  error:   { chip:"bg-red-500/15 text-red-300 border-red-500/25 hover:border-red-400",         ring:"focus-within:border-red-500 focus-within:ring-red-500/20",         dot:"bg-red-400" },
  info:    { chip:"bg-sky-500/15 text-sky-300 border-sky-500/25 hover:border-sky-400",          ring:"focus-within:border-sky-500 focus-within:ring-sky-500/20",          dot:"bg-sky-400" },
};

// -- Tag Chip ---------------------------------------------------------------
interface ChipProps { tag: Tag; styles: string; onDelete: (id:string) => void; readOnly?: boolean; }

function TagChip({ tag, styles, onDelete, readOnly }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium
      transition-all duration-150 select-none group ${styles}`}>
      {tag.label}
      {!readOnly && (
        <button
          type="button"
          onClick={() => onDelete(tag.id)}
          aria-label={`Remove ${tag.label}`}
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center ml-0.5
            opacity-50 hover:opacity-100 hover:bg-white/20 transition-opacity"
        >
          <svg viewBox="0 0 8 8" fill="currentColor" className="w-2 h-2">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
      )}
    </span>
  );
}

// -- Core Tag Input ---------------------------------------------------------
function TagInput({
  label, placeholder = "Add a tag...", maxTags = 20, variant = "default",
  suggestions = [], allowDuplicates = false, delimiter = ["Enter", ",", "Tab"],
  initialTags = [], readOnly = false, onTagsChange,
}: TagInputProps) {
  const [tags, setTags]           = useState<Tag[]>(() => initialTags.map(t => ({ id: uid(), label: t })));
  const [input, setInput]         = useState("");
  const [focused, setFocused]     = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestIdx, setSuggestIdx]   = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const styles = VARIANT_STYLES[variant];

  const addTag = (rawLabel: string) => {
    const label = rawLabel.trim();
    if (!label) return;
    if (!allowDuplicates && tags.some(t => t.label.toLowerCase() === label.toLowerCase())) return;
    if (tags.length >= maxTags) return;
    const next = [...tags, { id: uid(), label }];
    setTags(next);
    setInput("");
    setShowSuggest(false);
    onTagsChange?.(next.map(t => t.label));
  };

  const deleteTag = (tagId: string) => {
    const next = tags.filter(t => t.id !== tagId);
    setTags(next);
    onTagsChange?.(next.map(t => t.label));
    inputRef.current?.focus();
  };

  const deleteLastTag = () => {
    if (!input && tags.length > 0) deleteTag(tags[tags.length - 1].id);
  };

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) &&
    !tags.some(t => t.label.toLowerCase() === s.toLowerCase())
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (delimiter.includes(e.key)) {
      e.preventDefault();
      if (showSuggest && suggestIdx >= 0) {
        addTag(filteredSuggestions[suggestIdx]);
        setSuggestIdx(-1);
      } else {
        addTag(input);
      }
      return;
    }
    if (e.key === "Backspace" && !input) { deleteLastTag(); return; }
    if (e.key === "Escape") { setShowSuggest(false); setSuggestIdx(-1); return; }
    if (e.key === "ArrowDown" && showSuggest) {
      e.preventDefault();
      setSuggestIdx(i => Math.min(i + 1, filteredSuggestions.length - 1));
    }
    if (e.key === "ArrowUp" && showSuggest) {
      e.preventDefault();
      setSuggestIdx(i => Math.max(i - 1, -1));
    }
  };

  const atMax = tags.length >= maxTags;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
          {maxTags < 100 && (
            <span className="ml-2 text-xs text-slate-500">({tags.length}/{maxTags})</span>
          )}
        </label>
      )}

      <div className="relative">
        {/* Input wrapper */}
        <div
          onClick={() => !readOnly && inputRef.current?.focus()}
          className={`flex flex-wrap gap-1.5 p-2 min-h-[44px] bg-slate-800 border border-slate-700
            rounded-xl cursor-text transition-all duration-150
            focus-within:ring-2 ${styles.ring}
            ${atMax ? "opacity-60" : ""}`}
        >
          {tags.map(tag => (
            <TagChip key={tag.id} tag={tag} styles={styles.chip} onDelete={deleteTag} readOnly={readOnly} />
          ))}

          {!readOnly && !atMax && (
            <input
              ref={inputRef}
              id={id}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                setShowSuggest(e.target.value.length > 0 && suggestions.length > 0);
                setSuggestIdx(-1);
              }}
              onKeyDown={onKeyDown}
              onFocus={() => { setFocused(true); if (input && suggestions.length) setShowSuggest(true); }}
              onBlur={() => { setFocused(false); setTimeout(() => setShowSuggest(false), 150); }}
              placeholder={tags.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-200
                placeholder-slate-600 outline-none py-0.5 px-1"
              aria-autocomplete="list"
            />
          )}

          {atMax && !readOnly && (
            <span className="text-xs text-slate-500 px-1 py-1">Max {maxTags} tags reached</span>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggest && filteredSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-700
            rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s, i) => (
              <button key={s} type="button"
                onMouseDown={() => { addTag(s); setSuggestIdx(-1); }}
                className={`w-full text-left px-4 py-2 text-sm transition flex items-center gap-2
                  ${i === suggestIdx ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-600 mt-1.5">
        Press <kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or <kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-mono text-[10px]">,</kbd> to add.
        {" "}<kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-mono text-[10px]">Backspace</kbd> to remove last.
      </p>
    </div>
  );
}

// -- Demo page --------------------------------------------------------------
const TECH_SUGGESTIONS = [
  "React","TypeScript","JavaScript","CSS","HTML","Node.js","Python","Rust","Go",
  "Docker","Kubernetes","GraphQL","REST","PostgreSQL","Redis","AWS","Tailwind",
];

const SKILL_SUGGESTIONS = [
  "Leadership","Communication","Problem Solving","Critical Thinking","Teamwork",
  "Creativity","Time Management","Adaptability","Attention to Detail","Mentoring",
];

export default function App() {
  const [techTags, setTechTags]   = useState<string[]>([]);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-8">

        {/* Header */}
        <div className="text-center pt-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Tag Input Component</h1>
          <p className="text-sm text-slate-500">Type to add, comma-separated, with autocomplete suggestions.</p>
        </div>

        {/* Demo 1 - Tech stack */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Demo 1 - Tech Stack (with suggestions)
          </p>
          <TagInput
            label="Technologies"
            placeholder="Add a technology..."
            suggestions={TECH_SUGGESTIONS}
            initialTags={["React","TypeScript","Tailwind"]}
            maxTags={10}
            variant="default"
            onTagsChange={setTechTags}
          />
          {techTags.length > 0 && (
            <p className="text-xs text-slate-600 mt-3">
              Value: <span className="text-slate-400">{techTags.join(", ")}</span>
            </p>
          )}
        </div>

        {/* Demo 2 - Skills (success variant, max 5) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Demo 2 - Skills (success, max 5)
          </p>
          <TagInput
            label="Key Skills"
            placeholder="Add a skill..."
            suggestions={SKILL_SUGGESTIONS}
            maxTags={5}
            variant="success"
            onTagsChange={setSkillTags}
          />
        </div>

        {/* Demo 3 - Filters (warning, no duplicates message) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Demo 3 - Search Filters (warning variant)
          </p>
          <TagInput
            label="Active Filters"
            placeholder="Type a filter..."
            variant="warning"
            allowDuplicates={false}
            onTagsChange={setFilterTags}
          />
          {filterTags.length > 0 && (
            <p className="text-xs text-slate-600 mt-3">
              {filterTags.length} filter{filterTags.length !== 1 ? "s" : ""} active
            </p>
          )}
        </div>

        {/* Demo 4 - Error variant */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Demo 4 - Error State
          </p>
          <TagInput
            label="Email Recipients"
            placeholder="Add email address..."
            variant="error"
            initialTags={["alice@example.com"]}
            delimiter={["Enter", "Tab", " "]}
          />
          <p className="text-xs text-red-400 mt-2">One or more addresses are invalid.</p>
        </div>

        {/* Demo 5 - Read-only */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Demo 5 - Read Only
          </p>
          <TagInput
            label="Assigned Labels"
            variant="info"
            initialTags={["bug","high-priority","frontend","needs-review"]}
            readOnly
          />
        </div>

        {/* Demo 6 - All five variants showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            All Variants
          </p>
          <div className="space-y-3">
            {(["default","success","warning","error","info"] as Variant[]).map(v => (
              <div key={v} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-16 capitalize">{v}</span>
                <div className="flex gap-1.5">
                  {["Tag A","Tag B","Tag C"].map(t => (
                    <TagChip key={t}
                      tag={{id:t,label:t}}
                      styles={VARIANT_STYLES[v].chip}
                      onDelete={()=>{}}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}