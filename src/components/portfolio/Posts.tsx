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
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        },
        body: JSON.stringify({ message: "verify", password }),
      });
      if (res.ok) {
        setAdminUnlocked(true);
        toast({ title: "Admin mode enabled ✅" });
      } else {
        toast({ title: "Wrong password" });
      }
    } catch {
      toast({ title: "Connection error" });
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
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
        },
        body: JSON.stringify({ message: newMessage, password }),
      });
      if (res.ok) {
        toast({ title: "Post published ✅" });
        setNewMessage("");
        fetchPosts();
      }
    } catch {
      toast({ title: "Connection error" });
    }
    setSending(false);
  };

  const deletePost = async (postId: string) => {
    await supabase.from("posts").delete().eq("id", postId);
    fetchPosts();
    fetchReactions();
  };

  const reactToPost = async (postId: string, emoji: string) => {
    if (!visitorId) return;
    await supabase.from("post_reactions").insert({
      post_id: postId,
      visitor_id: visitorId,
      emoji,
    });
    fetchReactions();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={() => setShow(false)}
      >
        <motion.div
          className="bg-card border-2 border-accent/30 rounded-2xl w-full max-w-2xl max-h-[92vh] h-full flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b">Posts ({posts.length})</div>

          {/* Posts */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0 pb-24">
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded-xl">
                <p>{post.message}</p>
                <div className="flex gap-2 mt-2">
                  {EMOJIS.map((emoji) => (
                    <button key={emoji} onClick={() => reactToPost(post.id, emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom fixed */}
          <div className="shrink-0">
            {adminRequested && !adminUnlocked && (
              <div className="p-4 border-t flex gap-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={verifyPassword}>Unlock</Button>
              </div>
            )}

            {adminUnlocked && (
              <div className="p-4 border-t">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button onClick={publishPost} className="w-full mt-2">
                  Publish
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Posts;
