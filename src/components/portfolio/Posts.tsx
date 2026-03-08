import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Lock, MessageSquare } from "lucide-react";
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
  const [reactions, setReactions] = useState<Record<string, ReactionCount[]>>(
    {}
  );
  const [adminRequested, setAdminRequested] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const { toast } = useToast();

  useScrollLock(show);

  // Init visitor
  useEffect(() => {
    getOrCreateVisitorId().then(setVisitorId);
  }, []);

  // Listen for events
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
        grouped[r.post_id][r.emoji] =
          (grouped[r.post_id][r.emoji] || 0) + 1;
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "verify", password }),
      });
      if (res.ok) {
        setAdminUnlocked(true);
        toast({
          title: "Admin mode enabled ✅",
          className: "bg-green-600 text-white border-green-700",
        });
      } else {
        toast({
          title: "Wrong password",
          variant: "destructive",
          className: "bg-red-600 text-white border-red-700",
        });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage, password }),
      });
      if (res.ok) {
        toast({
          title: "Post published ✅",
          className: "bg-green-600 text-white border-green-700",
        });
        setNewMessage("");
        fetchPosts();
      } else {
        const text = await res.text();
        toast({
          title: text || "Failed to publish",
          variant: "destructive",
          className: "bg-red-600 text-white border-red-700",
        });
      }
    } catch {
      toast({ title: "Connection error", variant: "destructive" });
    }
    setSending(false);
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      toast({
        title: "Post deleted",
        className: "bg-green-600 text-white border-green-700",
      });
      fetchPosts();
      fetchReactions();
    } else {
      toast({
        title: "Failed to delete. Add a DELETE RLS policy on the posts table.",
        variant: "destructive",
      });
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
      // Likely duplicate — already reacted
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
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-card border-2 border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.12)] rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Posts
              </h3>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Posts list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {posts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No posts yet. Check back soon!
              </div>
            )}
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/40 border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        John Doe
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                  {adminUnlocked && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.message}
                </p>

                {/* Reaction counts */}
                {reactions[post.id] && reactions[post.id].length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {reactions[post.id].map((r) => (
                      <span
                        key={r.emoji}
                        className="text-xs bg-secondary border border-border rounded-full px-2 py-0.5"
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}

                {/* Emoji tray */}
                <div className="flex gap-1 pt-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => reactToPost(post.id, emoji)}
                      className="text-base hover:scale-125 transition-transform p-1 rounded hover:bg-secondary"
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
            <div className="p-4 border-t border-border bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} className="text-accent" />
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Admin Login
                </p>
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
                <Button
                  variant="hero"
                  size="sm"
                  onClick={verifyPassword}
                  disabled={sending}
                >
                  Unlock
                </Button>
              </div>
            </div>
          )}

          {/* Post composer */}
          {adminUnlocked && (
            <div className="p-4 border-t border-border bg-secondary/30">
              <Textarea
                placeholder="Write a new post..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                className="bg-card border-border text-sm resize-none mb-2"
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
