import { useQuery } from "@tanstack/react-query";
import { categories, Post } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import PostCard from "@/components/blog/post-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [selectedCategory ? `/api/posts/category/${selectedCategory}` : "/api/posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mb-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex gap-8">
          <Sidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 shrink-0`}
          />

          <main className="flex-1">
            <h1 className="text-4xl font-bold mb-8">
              {selectedCategory || "Latest Posts"}
            </h1>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}