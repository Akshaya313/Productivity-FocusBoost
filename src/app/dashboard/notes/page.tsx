"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProductivityStore, Note } from "@/store/useProductivityStore";
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  FileText,
  Tag,
  Check,
  CloudLightning,
  CornerDownRight,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrainNotes() {
  const {
    notes,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    setActiveNoteId
  } = useProductivityStore();

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editorMode, setEditorMode] = useState<"write" | "preview">("write");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "typing">("saved");

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Sync editor fields when active note changes
  useEffect(() => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
      setEditTags(activeNote.tags.join(", "));
      setSaveStatus("saved");
    } else {
      setEditTitle("");
      setEditContent("");
      setEditTags("");
    }
  }, [activeNoteId]);

  // Debounced auto-save handler
  const triggerAutoSave = (updatedTitle: string, updatedContent: string, updatedTagsStr: string) => {
    if (!activeNoteId) return;
    setSaveStatus("typing");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saving");
      
      const tags = updatedTagsStr
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      updateNote(activeNoteId, updatedTitle, updatedContent, tags);
      
      setTimeout(() => {
        setSaveStatus("saved");
      }, 500);
    }, 1000); // 1-second debounce
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditTitle(val);
    triggerAutoSave(val, editContent, editTags);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditContent(val);
    triggerAutoSave(editTitle, val, editTags);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditTags(val);
    triggerAutoSave(editTitle, editContent, val);
  };

  const handleCreateNote = () => {
    addNote("Untitled Note", "# Add heading here\nStart dumping your brain thoughts...", ["Dump"]);
    setSaveStatus("saved");
  };

  // Helper to compile basic markdown preview elements
  const renderMarkdownHTML = (md: string) => {
    const lines = md.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-xl sm:text-2xl font-black text-white mt-4 mb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-base sm:text-lg font-bold text-white mt-3.5 mb-1.5">{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-semibold text-white mt-3 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="text-xs text-[var(--text-muted)] list-disc ml-4 my-1">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith("1. ")) {
        return (
          <li key={idx} className="text-xs text-[var(--text-muted)] list-decimal ml-4 my-1">
            {line.slice(3)}
          </li>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-[var(--accent)] pl-3 py-1.5 my-2.5 bg-white/5 rounded-r text-xs text-[var(--text-muted)] italic leading-relaxed">
            {line.slice(2)}
          </blockquote>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-[var(--text-muted)] leading-relaxed my-1.5">{line}</p>;
    });
  };

  const allNoteTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  // Filter notes by search query and tag selection
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                          n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag ? n.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  // Sort notes so pinned ones are always at the top!
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Brain Dump Notebook</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Capture fleeting flashes of inspiration. Supports debounced auto-saving and search indexes.
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="px-3.5 py-2 rounded-xl bg-accent-gradient hover:opacity-90 transition-opacity text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/5 shadow-md self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Container Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        
        {/* Left Column: Notes backlogs panel */}
        <div className="glass-panel rounded-2xl border border-white/5 flex flex-col p-4 overflow-hidden h-full">
          {/* Search bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="absolute left-2.5 top-2 text-[var(--text-muted)]" size={13} />
            <input
              type="text"
              placeholder="Search notebook content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-lg pl-8 pr-4 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Tags scroll bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-3 border-b border-white/5 mb-3 shrink-0">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer whitespace-nowrap",
                !activeTag ? "bg-accent-gradient text-white" : "bg-white/5 text-[var(--text-muted)] hover:text-white"
              )}
            >
              All
            </button>
            {allNoteTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-0.5",
                  activeTag === tag ? "bg-accent-gradient text-white" : "bg-white/5 text-[var(--text-muted)] hover:text-white"
                )}
              >
                <Tag size={6} />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {/* Notes items list */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-2">
            {sortedNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const dateObj = new Date(note.updatedAt);
              const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer border transition-all text-left flex flex-col gap-1.5 relative group",
                    isActive
                      ? "bg-accent-gradient border-white/10 text-white shadow-lg shadow-purple-500/5"
                      : "bg-white/5 border-transparent text-[var(--foreground)] hover:bg-white/10 hover:border-white/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold truncate pr-3">{note.title || "Untitled Note"}</span>
                    {note.pinned && (
                      <Pin size={10} className="fill-white text-white shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* snippet */}
                  <span className={cn(
                    "text-[10px] line-clamp-1 leading-relaxed",
                    isActive ? "text-white/80" : "text-[var(--text-muted)]"
                  )}>
                    {note.content.replace(/[#*>\-]/g, "").slice(0, 80)}
                  </span>

                  <div className="flex items-center justify-between text-[9px] mt-1 shrink-0">
                    <span className={isActive ? "text-white/60" : "text-[var(--text-muted)]"}>{formattedDate}</span>
                    <div className="flex items-center gap-1.5">
                      {note.tags.slice(0, 2).map((t) => (
                        <span key={t} className="bg-white/10 border border-white/5 px-1 py-0.2 rounded text-[8px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedNotes.length === 0 && (
              <div className="text-center text-xs text-[var(--text-muted)] py-12 flex flex-col items-center gap-1">
                <BookOpen size={24} className="text-white/10 mb-2" />
                <span>No notes logged yet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Notebook detailed Editor */}
        <div className="md:col-span-2 glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full bg-black/10">
          {activeNote ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Editor Header metadata */}
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/15">
                <div className="flex items-center gap-3">
                  <div className="flex bg-black/45 p-0.5 rounded-lg border border-white/5 gap-0.5">
                    <button
                      onClick={() => setEditorMode("write")}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1",
                        editorMode === "write" ? "bg-accent-gradient text-white" : "text-[var(--text-muted)] hover:text-white"
                      )}
                    >
                      <Edit size={10} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setEditorMode("preview")}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1",
                        editorMode === "preview" ? "bg-accent-gradient text-white" : "text-[var(--text-muted)] hover:text-white"
                      )}
                    >
                      <Eye size={10} />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Auto-save visual feedback capsule */}
                  <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-[9px] font-semibold text-[var(--text-muted)]">
                    {saveStatus === "saved" && (
                      <>
                        <Check size={10} className="text-emerald-400" />
                        <span>Saved to Cloud</span>
                      </>
                    )}
                    {saveStatus === "saving" && (
                      <>
                        <CloudLightning size={10} className="text-amber-400 animate-bounce" />
                        <span>Saving...</span>
                      </>
                    )}
                    {saveStatus === "typing" && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        <span>Typing...</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePinNote(activeNote.id)}
                    className={cn(
                      "p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer transition-colors border border-white/5",
                      activeNote.pinned && "bg-purple-500/10 text-[var(--accent)] border-purple-500/20"
                    )}
                    title="Pin note to top"
                  >
                    <Pin size={12} className={activeNote.pinned ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this notebook card permanently?")) {
                        deleteNote(activeNote.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-400 cursor-pointer transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Editor Workspace viewport */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 h-full no-scrollbar">
                {editorMode === "write" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Title of note..."
                      value={editTitle}
                      onChange={handleTitleChange}
                      className="w-full bg-transparent border-0 border-b border-white/5 pb-2 text-base font-black text-white outline-none focus:border-[var(--accent)] transition-colors placeholder-white/20"
                    />

                    <input
                      type="text"
                      placeholder="Tags (comma-separated)..."
                      value={editTags}
                      onChange={handleTagsChange}
                      className="w-full bg-transparent border-0 text-[10px] text-[var(--text-muted)] font-mono outline-none placeholder-white/15"
                    />

                    <textarea
                      placeholder="Support markdown styling:
# Header 1
## Header 2
- Bullet points
> Blockquotes
Write your productivity log details..."
                      value={editContent}
                      onChange={handleContentChange}
                      className="w-full flex-1 bg-transparent border-0 outline-none text-xs text-white leading-relaxed resize-none h-60 placeholder-white/25 focus:ring-0 select-text"
                    />
                  </>
                ) : (
                  // Preview rendering Mode
                  <div className="flex-1 text-left flex flex-col gap-1 select-text">
                    <h2 className="text-xl font-black text-white border-b border-white/5 pb-2">
                      {editTitle || "Untitled Note"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-4 text-[9px] text-[var(--text-muted)] font-mono">
                      <span>Tags:</span>
                      {editTags ? (
                        editTags.split(",").map((t) => (
                          <span key={t} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-[8px]">
                            {t.trim()}
                          </span>
                        ))
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                    <div className="flex-1 text-xs select-text">
                      {renderMarkdownHTML(editContent)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3 select-none">
              <FileText size={48} className="text-white/5 mb-2" />
              <span className="text-xs font-bold text-white">No active note chosen</span>
              <p className="text-[10px] text-[var(--text-muted)] max-w-xs leading-relaxed">
                Click on any notebook card on the sidebar to inspect details, or create a brand new note to begin tracking ideas.
              </p>
              <button
                onClick={handleCreateNote}
                className="mt-2 py-1.5 px-3 rounded-xl bg-accent-gradient text-white text-[11px] font-bold border border-white/10 cursor-pointer hover:opacity-90"
              >
                Create new document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
