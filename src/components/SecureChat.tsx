import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { getBriefMessages, sendBriefMessage } from "@/lib/api/chat.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function SecureChat({ briefId, currentUserId }: { briefId: string; currentUserId: string }) {
  const fetchMessages = useServerFn(getBriefMessages);
  const sendMessage = useServerFn(sendBriefMessage);
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const q = useQuery({
    queryKey: ["brief_messages", briefId],
    queryFn: () => fetchMessages({ data: { briefId } }),
  });

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${briefId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "brief_messages",
          filter: `brief_id=eq.${briefId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["brief_messages", briefId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [briefId, qc]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [q.data]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage({ data: { briefId, content } });
      setContent("");
      qc.invalidateQueries({ queryKey: ["brief_messages", briefId] });
    } catch (err: any) {
      alert("Failed to send: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] border border-border rounded-md bg-white">
      <div className="p-3 border-b border-border bg-muted/30">
        <h4 className="font-semibold text-sm">Secure Chat</h4>
        <p className="text-xs text-muted-foreground">
          Contact details (email, phone) are automatically masked for privacy.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {q.isLoading && (
          <p className="text-sm text-center text-muted-foreground">Loading chat...</p>
        )}
        {q.data?.map((msg: any) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  isMe
                    ? "bg-forest text-white rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <span className="text-[10px] opacity-70 mt-1 block text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        {q.data?.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No messages yet. Send a message to start the conversation.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
        <Textarea
          className="min-h-[40px] h-[40px] py-2 resize-none"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <Button type="submit" disabled={!content.trim() || sending}>
          Send
        </Button>
      </form>
    </div>
  );
}
