import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Lock, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  supabase,
  EDGE_FUNCTION_VERIFY_URL,
  EDGE_FUNCTION_PUBLISH_URL,
  getOrCreateVisitorId,
} from "@/lib/supabase";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const EMOJIS = ["👍", "❤️", "🔥", "🚀", "💯", "👏", "😎"];

interface Post {
  id: string;
  message: string;
  created_at: string;
}

interface ReactionCount {
  emoji: string;
  count: number;
}

const Posts = () => {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Record<string, ReactionCount[]>>({});
  const [adminRequested, setAdminRequested] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const { toast } = useToast();

  useScrollLock(show);

  useEffect(() => {
    getOrCreateVisitorId().then(setVisitorId);
  }, []);

  useEffect(() => {
    const openHandler = () => setShow(true);
    const adminHandler = () => {
      setAdminRequested((prev) => {
        const next = !prev;
        if (!next) {
          setAdminUnlocked(false);
          setPassword("");
        }
        toast({
          title: next ? "Admin login enabled 🔓" : "Admin mode disabled 🔒",
          description: next ? "Enter your password to manage posts." : "Admin access revoked.",
          className: next
            ? "bg-accent text-accent-foreground border-accent"
            : "bg-secondary text-foreground border-border",
        });
        return next;
      });
    };
    window.addEventListener("openPosts", openHandler);
    window.addEventListener("adminToggle", adminHandler);
    return () => {
      window.removeEventListener("openPosts", openHandler);
      window.removeEventListener("adminToggle", adminHandler);
    };
  }, [toast]);

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .neq("message", "verify")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  }, []);

  const fetchReactions = useCallback(async () => {
    const { data } = await supabase
      .from("post_reactions")
      .select("post_id, emoji");
    if (data) {
      const grouped: Record<string, Record<string, number>> = {};
      data.forEach((r: { post_id: string; emoji: string }) => {
        if (!grouped[r.post_id]) grouped[r.post_id] = {};
        grouped[r.post_id][r.emoji] = (grouped[r.post_id][r.emoji] || 0) + 1;
      });
      const result: Record<string, ReactionCount[]> = {};
      Object.entries(grouped).forEach(([pid, emojis]) => {
        result[pid] = Object.entries(emojis)
          .map(([emoji, count]) => ({ emoji, count }))
          .sort((a, b) => b.count - a.count);
      });
      setReactions(result);
    }
  }, []);

  useEffect(() => {
    if (show) {
      fetchPosts();
      fetchReactions();
    }
  }, [show, fetchPosts, fetchReactions]);

  const verifyPassword = async () => {
    if (!password.trim()) return;
    setSending(true);
    try {
      const res = await fetch(EDGE_FUNCTION_VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        },
        body: JSON.stringify({ message: "verify", password }),
      });
      if (res.ok) {
        setAdminUnlocked(true);
        toast({ title: "Admin mode enabled ✅", className: "bg-green-600 text-white border-green-700" });
      } else {
        toast({ title: "Wrong password", variant: "destructive", className: "bg-red-600 text-white border-red-700" });
      }
    } catch {
      toast({ title: "Connection error", variant: "destructive" });
    }
    setSending(false);
  };

  const publishPost = async () => {
    if (!adminUnlocked || !newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch(EDGE_FUNCTION_PUBLISH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        },
        body: JSON.stringify({ message: newMessage, password }),
      });
      if (res.ok) {
        toast({ title: "Post published ✅", className: "bg-green-600 text-white border-green-700" });
        setNewMessage("");
        fetchPosts();
      } else {
        const text = await res.text();
        toast({ title: text || "Failed to publish", variant: "destructive", className: "bg-red-600 text-white border-red-700" });
      }
    } catch {
      toast({ title: "Connection error", variant: "destructive" });
    }
    setSending(false);
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      toast({ title: "Post deleted", className: "bg-green-600 text-white border-green-700" });
      fetchPosts();
      fetchReactions();
    } else {
      toast({ title: "Failed to delete. Add a DELETE RLS policy on the posts table.", variant: "destructive" });
    }
  };

  const reactToPost = async (postId: string, emoji: string) => {
    if (!visitorId) return;
    const { error } = await supabase.from("post_reactions").insert({
      post_id: postId,
      visitor_id: visitorId,
      emoji,
    });
    if (error) {
      toast({ title: "Already reacted with this emoji!" });
    }
    fetchReactions();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8"
        onClick={() => setShow(false)}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-card border-2 border-accent/30 shadow-[0_0_40px_hsl(var(--accent)/0.15)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <MessageSquare size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Posts</h3>
                <p className="text-xs text-muted-foreground">{posts.length} {posts.length === 1 ? "post" : "posts"} published</p>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground hover:rotate-90 transition-all duration-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Posts list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 min-h-[400px]">
            {posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Sparkles size={32} className="mb-3 text-accent/40" />
                <p className="text-sm font-medium">No posts yet</p>
                <p className="text-xs mt-1">Check back soon for updates!</p>
              </div>
            )}
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-secondary/30 border border-border rounded-xl p-5 space-y-4 hover:border-accent/30 hover:bg-secondary/50 hover:shadow-[0_4px_20px_hsl(var(--accent)/0.08)] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-bold text-accent ring-2 ring-accent/10">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">John Doe</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  {adminUnlocked && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                      title="Delete post"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pl-[52px]">
                  {post.message}
                </p>

                {/* Reaction counts */}
                {reactions[post.id] && reactions[post.id].length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-[52px]">
                    {reactions[post.id].map((r) => (
                      <span
                        key={r.emoji}
                        className="text-xs bg-secondary border border-border rounded-full px-2.5 py-1 hover:border-accent/30 hover:scale-105 transition-all duration-200 cursor-default"
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}

                {/* Emoji tray */}
                <div className="flex gap-1.5 pl-[52px] pt-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => reactToPost(post.id, emoji)}
                      className="text-base hover:scale-130 active:scale-95 transition-transform duration-200 p-1.5 rounded-lg hover:bg-accent/10"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Admin panel */}
          {adminRequested && !adminUnlocked && (
            <div className="p-5 border-t border-border bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={14} className="text-accent" />
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Admin Login</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
                  className="bg-card border-border text-sm"
                />
                <Button variant="hero" size="sm" onClick={verifyPassword} disabled={sending}>
                  Unlock
                </Button>
              </div>
            </div>
          )}

          {/* Post composer */}
          {adminUnlocked && (
            <div className="p-5 border-t border-border bg-secondary/30">
              <Textarea
                placeholder="Write a new post..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
                className="bg-card border-border text-sm resize-none mb-3"
              />
              <Button
                variant="hero"
                size="sm"
                onClick={publishPost}
                disabled={sending || !newMessage.trim()}
                className="w-full"
              >
                <Send size={14} />
                {sending ? "Publishing..." : "Publish"}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Posts;
