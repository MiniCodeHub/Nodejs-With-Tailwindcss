import { useState, useEffect, useRef, useCallback } from "react";

// -- Types ------------------------------------------------------------------
type Category = "Design" | "Engineering" | "Product" | "Career" | "AI";

interface Post {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  role: string;
  time: string;
  category: Category;
  title: string;
  body: string;
  likes: number;
  comments: number;
  bookmarked: boolean;
  liked: boolean;
  image?: boolean;
  imageColor?: string;
}

// -- Post factory -----------------------------------------------------------
const AVATARS = [
  { author:"Alice Walker",    initials:"AW", color:"bg-indigo-500",  role:"Senior Designer" },
  { author:"Bob Kim",         initials:"BK", color:"bg-emerald-500", role:"Staff Engineer" },
  { author:"Carol Mendes",    initials:"CM", color:"bg-pink-500",    role:"Product Manager" },
  { author:"Dave Lin",        initials:"DL", color:"bg-amber-500",   role:"ML Engineer" },
  { author:"Eve Rahman",      initials:"ER", color:"bg-violet-500",  role:"Design Lead" },
  { author:"Frank Chen",      initials:"FC", color:"bg-cyan-500",    role:"Frontend Dev" },
  { author:"Grace Obi",       initials:"GO", color:"bg-rose-500",    role:"Engineering Manager" },
];

const POSTS_DATA: Omit<Post, "id" | "bookmarked" | "liked">[] = [
  { author:"Alice Walker",   initials:"AW", avatarColor:"bg-indigo-500",  role:"Senior Designer",      time:"2m ago",   category:"Design",      title:"The case for boring design",                       body:"Every team eventually learns that the most impactful design decision is often the most boring one. Consistency beats cleverness every single time. Here's what I've learned building design systems for the past five years.",          likes:284,  comments:42, image:true,  imageColor:"from-indigo-800 to-indigo-950" },
  { author:"Bob Kim",        initials:"BK", avatarColor:"bg-emerald-500", role:"Staff Engineer",       time:"18m ago",  category:"Engineering", title:"Why I stopped writing clever code",                body:"There's a special kind of satisfaction in writing code that makes other engineers go 'oh, that's clever.' There's also a special kind of regret when you have to debug it six months later at 2am.",                                      likes:512,  comments:88 },
  { author:"Carol Mendes",   initials:"CM", avatarColor:"bg-pink-500",    role:"Product Manager",      time:"1h ago",   category:"Product",     title:"Saying no is the hardest product skill",           body:"Every PM says they know how to say no. Almost none of them do it well. The key isn't the word -- it's the framework behind it, and the confidence to hold the line when everyone else is pushing back.",                                  likes:193,  comments:31, image:true,  imageColor:"from-pink-800 to-rose-950" },
  { author:"Dave Lin",       initials:"DL", avatarColor:"bg-amber-500",   role:"ML Engineer",          time:"2h ago",   category:"AI",          title:"Embeddings are eating the world",                  body:"If you aren't thinking about vector databases yet, you will be soon. The shift from keyword search to semantic search is happening faster than most people realise, and the implications for every product category are enormous.",         likes:741,  comments:120 },
  { author:"Eve Rahman",     initials:"ER", avatarColor:"bg-violet-500",  role:"Design Lead",          time:"3h ago",   category:"Design",      title:"Designing for edge cases is designing for everyone", body:"Every accessibility improvement has made our product better for all users. Large touch targets help people with motor impairments -- and also anyone holding a phone one-handed on a crowded train. Edge cases are mainstream.",           likes:328,  comments:57, image:true,  imageColor:"from-violet-800 to-purple-950" },
  { author:"Frank Chen",     initials:"FC", avatarColor:"bg-cyan-500",    role:"Frontend Dev",         time:"5h ago",   category:"Engineering", title:"The real cost of a third-party dependency",        body:"Every npm package you install is a promise: to maintain it, audit it, update it, and eventually replace it. Most teams wildly underestimate this cost. Here's a framework for deciding what to bring in versus what to build.",           likes:467,  comments:74 },
  { author:"Grace Obi",      initials:"GO", avatarColor:"bg-rose-500",    role:"Engineering Manager",  time:"8h ago",   category:"Career",      title:"What 1:1s are actually for",                       body:"If you're using your 1:1s to give status updates, you're wasting them. Status updates belong in async tools. The 1:1 is the only meeting that exists exclusively for the other person. Are you using it that way?",                    likes:856,  comments:143 },
  { author:"Alice Walker",   initials:"AW", avatarColor:"bg-indigo-500",  role:"Senior Designer",      time:"10h ago",  category:"Design",      title:"Why dark mode is harder than it looks",            body:"It isn't just inverting colors. Dark mode requires rethinking contrast ratios, shadow behavior, brand color usage, and even which illustrations you can reuse. A well-done dark mode is a full redesign.",                              likes:215,  comments:39, image:true,  imageColor:"from-slate-700 to-slate-900" },
  { author:"Dave Lin",       initials:"DL", avatarColor:"bg-amber-500",   role:"ML Engineer",          time:"12h ago",  category:"AI",          title:"The prompt is the product",                        body:"Prompt engineering has a branding problem. It sounds like a workaround. In reality, crafting precise, reliable prompts is software engineering -- with all the discipline, testing, and maintenance that entails.",                        likes:623,  comments:97 },
  { author:"Bob Kim",        initials:"BK", avatarColor:"bg-emerald-500", role:"Staff Engineer",       time:"1d ago",   category:"Engineering", title:"Distributed systems and the lies we tell ourselves", body:"'It'll be fine -- we're not at that scale yet.' Famous last words. The decisions you make at 100 users tend to calcify into the architecture you're still fighting at 10 million.",                                                  likes:389,  comments:65 },
];

function generateBatch(startId: number, count: number): Post[] {
  return Array.from({ length: count }, (_, i) => {
    const template = POSTS_DATA[(startId + i) % POSTS_DATA.length];
    return { ...template, id: startId + i, bookmarked: false, liked: false,
      likes: template.likes + Math.floor(Math.random() * 20 - 10) };
  });
}

// -- Category pill ----------------------------------------------------------
const CAT_COLORS: Record<Category, string> = {
  Design:      "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  Engineering: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Product:     "bg-pink-500/15 text-pink-400 border-pink-500/20",
  Career:      "bg-amber-500/15 text-amber-400 border-amber-500/20",
  AI:          "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

// -- Skeleton ---------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-800 rounded w-32" />
          <div className="h-2.5 bg-slate-800 rounded w-24" />
        </div>
        <div className="h-5 w-16 bg-slate-800 rounded-full" />
      </div>
      <div className="h-5 bg-slate-800 rounded w-3/4 mb-2" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
        <div className="h-3 bg-slate-800 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
        <div className="h-3 w-12 bg-slate-800 rounded" />
        <div className="h-3 w-12 bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-800 rounded ml-auto" />
      </div>
    </div>
  );
}

// -- Post Card --------------------------------------------------------------
interface PostCardProps { post: Post; onLike:(id:number)=>void; onBookmark:(id:number)=>void; }

function PostCard({ post, onLike, onBookmark }: PostCardProps) {
  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden
      hover:border-slate-700 transition-all duration-200 group">
      {/* Optional image */}
      {post.image && (
        <div className={`h-40 bg-gradient-to-br ${post.imageColor} flex items-center justify-center`}>
          <div className="text-5xl opacity-20 font-bold tracking-tighter text-white select-none">
            {post.category}
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full ${post.avatarColor} flex items-center justify-center
            text-xs font-bold text-white flex-shrink-0`}>
            {post.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{post.author}</p>
            <p className="text-xs text-slate-500">{post.role}  {post.time}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border
            ${CAT_COLORS[post.category]}`}>{post.category}</span>
        </div>

        {/* Content */}
        <h2 className="text-sm font-bold text-slate-100 mb-2 leading-snug group-hover:text-white transition">
          {post.title}
        </h2>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{post.body}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-slate-800">
          <button onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 text-xs transition
              ${post.liked ? "text-rose-400" : "text-slate-500 hover:text-rose-400"}`}>
            <span>{post.liked ? "" : ""}</span>
            <span>{post.liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition">
            <span></span><span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
            <span></span><span>Share</span>
          </button>
          <button onClick={() => onBookmark(post.id)} className="ml-auto">
            <span className={`text-sm transition
              ${post.bookmarked ? "text-amber-400" : "text-slate-600 hover:text-amber-400"}`}>
              {post.bookmarked ? "" : ""}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

// -- Main Component ---------------------------------------------------------
const BATCH_SIZE = 5;
const CATEGORIES: (Category | "All")[] = ["All","Design","Engineering","Product","Career","AI"];

export default function App() {
  const [posts, setPosts]           = useState<Post[]>(() => generateBatch(0, BATCH_SIZE));
  const [loading, setLoading]       = useState(false);
  const [hasMore, setHasMore]       = useState(true);
  const [activeFilter, setFilter]   = useState<Category | "All">("All");
  const nextId = useRef(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const totalLoaded = useRef(BATCH_SIZE);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const newPosts = generateBatch(nextId.current, BATCH_SIZE);
      setPosts(prev => [...prev, ...newPosts]);
      nextId.current += BATCH_SIZE;
      totalLoaded.current += BATCH_SIZE;
      if (totalLoaded.current >= 40) setHasMore(false);
      setLoading(false);
    }, 1200);
  }, [loading, hasMore]);

  // IntersectionObserver on sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const toggleLike     = (id: number) => setPosts(ps => ps.map(p => p.id === id ? {...p, liked: !p.liked} : p));
  const toggleBookmark = (id: number) => setPosts(ps => ps.map(p => p.id === id ? {...p, bookmarked: !p.bookmarked} : p));

  const displayed = activeFilter === "All" ? posts : posts.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-white text-base">Feed</h1>
          <span className="text-xs text-slate-500">{posts.length} posts loaded</span>
        </div>
        {/* Category tabs */}
        <div className="max-w-lg mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex-shrink-0
                ${activeFilter === cat
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-300"}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {displayed.map(post => (
          <PostCard key={post.id} post={post} onLike={toggleLike} onBookmark={toggleBookmark} />
        ))}

        {/* Skeleton loaders */}
        {loading && Array.from({length: 3}).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* End of feed */}
        {!hasMore && !loading && (
          <div className="text-center py-10 text-slate-600">
            <div className="text-2xl mb-2"></div>
            <p className="text-sm font-medium">You're all caught up</p>
            <p className="text-xs mt-1">{posts.length} posts loaded</p>
          </div>
        )}
      </main>
    </div>
  );
}