import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Post, Comment } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import { Bookmark, Share2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PostPage() {
  const [, params] = useRoute("/post/:id");
  const postId = Number(params?.id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");

  const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
    queryKey: [`/api/posts/${postId}`],
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${postId}/comments`],
    enabled: !!postId,
  });

  const { data: bookmarks } = useQuery<{ id: number }[]>({
    queryKey: ["/api/bookmarks"],
    enabled: !!user,
  });

  const isBookmarked = bookmarks?.some((b) => b.id === postId);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await apiRequest("DELETE", `/api/bookmarks/${postId}`);
      } else {
        await apiRequest("POST", `/api/bookmarks/${postId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: isBookmarked ? "Bookmark removed" : "Post bookmarked",
        duration: 2000,
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/posts/${postId}/comments`, { content: comment });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      toast({
        title: "Comment posted",
        duration: 2000,
      });
    },
  });

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/4 mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{post.category}</span>
              <time>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => bookmarkMutation.mutate()}
                >
                  <Bookmark
                    className={isBookmarked ? "fill-current" : ""}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 />
              </Button>
            </div>
          </div>
        </header>

        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mb-12">
          {post.content.split("\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </h2>

          {user && (
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                onClick={() => commentMutation.mutate()}
                disabled={!comment.trim() || commentMutation.isPending}
              >
                Post Comment
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {isLoadingComments ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-full" />
                </Card>
              ))
            ) : (
              comments?.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <p>{comment.content}</p>
                </Card>
              ))
            )}
          </div>
        </section>
      </article>
    </div>
  );
}