"use client";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
};

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<number | null>(null);

  const categories: string[] = ["General", "Work", "Study", "Personal"];

  /* LOAD NOTES */
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  /* SAVE NOTES */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  /* CREATE / UPDATE */
  const saveNote = () => {
    if (!title || !content) return;

    if (editingId !== null) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content, category }
            : note
        )
      );
      setEditingId(null);
    } else {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          title,
          content,
          category,
        },
      ]);
    }

    setTitle("");
    setContent("");
    setCategory("General");
  };

  /* DELETE */
  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  /* EDIT */
  const editNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  };

  /* FILTER */
  const filteredNotes =
    activeCategory === "All"
      ? notes
      : notes.filter((note) => note.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">Categories</h2>

          <button
            onClick={() => setActiveCategory("All")}
            className={`block w-full text-left px-3 py-2 rounded mb-2 ${
              activeCategory === "All" && "bg-cyan-500 text-white"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded mb-2 ${
                activeCategory === cat && "bg-cyan-500 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Main */}
        <section className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold mb-4">
              {editingId ? "Edit Note" : "Add Note"}
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full mb-3 p-2 border rounded"
              rows={4}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={saveNote}
              className="px-6 py-2 bg-cyan-500 text-white rounded"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white p-5 rounded-xl shadow">
                <span className="text-xs text-cyan-500">{note.category}</span>
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className="text-gray-600 text-sm">{note.content}</p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => editNote(note)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
