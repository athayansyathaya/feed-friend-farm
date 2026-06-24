import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Plus, Send, Trash2, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; messages: Message[] };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const newThread = (): Thread => ({
  id: crypto.randomUUID(),
  title: "Percakapan baru",
  messages: [],
});

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>(() => [newThread()]);
  const [activeId, setActiveId] = useState<string>(() => "");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!activeId && threads[0]) setActiveId(threads[0].id);
  }, [activeId, threads]);

  const active = threads.find((t) => t.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, activeId]);

  const updateThread = (id: string, updater: (t: Thread) => Thread) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
  };

  const handleNew = () => {
    const t = newThread();
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
  };

  const handleDelete = (id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const t = newThread();
        setActiveId(t.id);
        return [t];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !active) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const baseMessages = [...active.messages, userMsg];
    updateThread(active.id, (t) => ({
      ...t,
      title: t.messages.length === 0 ? text.slice(0, 40) : t.title,
      messages: [...baseMessages, { role: "assistant", content: "" }],
    }));
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ messages: baseMessages }),
      });

      if (!res.ok || !res.body) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              updateThread(active.id, (t) => {
                const msgs = [...t.messages];
                msgs[msgs.length - 1] = { role: "assistant", content: assistant };
                return { ...t, messages: msgs };
              });
            }
          } catch {
            /* ignore partial */
          }
        }
      }
    } catch (e: any) {
      toast.error("Gagal mengirim pesan", { description: e?.message });
      updateThread(active.id, (t) => ({
        ...t,
        messages: t.messages.slice(0, -1),
      }));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center hover:scale-105 transition-transform"
        )}
        aria-label="Buka chatbot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,720px)] h-[min(75vh,600px)] bg-card border border-border rounded-2xl shadow-2xl flex overflow-hidden">
          {/* Thread sidebar */}
          <aside className="hidden sm:flex flex-col w-56 border-r border-border bg-muted/30">
            <div className="p-3 border-b border-border">
              <Button onClick={handleNew} size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" /> Chat baru
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      "group flex items-center gap-1 rounded-md text-sm",
                      t.id === activeId ? "bg-primary/10" : "hover:bg-muted"
                    )}
                  >
                    <button
                      onClick={() => setActiveId(t.id)}
                      className="flex-1 truncate text-left px-2 py-2"
                    >
                      {t.title}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-muted-foreground hover:text-destructive"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sprout className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Asisten Pakan Cerdas</p>
                <p className="text-xs text-muted-foreground truncate">
                  Tanya berat rata-rata ternak (kg/ekor)
                </p>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {active?.messages.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8 space-y-2">
                  <p>👋 Halo! Tanya berat rata-rata ternak apa pun.</p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {[
                      "Berat rata-rata sapi dewasa?",
                      "Ayam broiler panen umur 35 hari?",
                      "Kambing etawa dewasa berapa kg?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {active?.messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {m.content || (loading && i === active.messages.length - 1 ? "…" : "")}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-border p-3 flex gap-2 items-end"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Tulis pertanyaanmu…"
                rows={1}
                className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
