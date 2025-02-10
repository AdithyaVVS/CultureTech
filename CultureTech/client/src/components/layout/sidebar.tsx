import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  categories: readonly string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  className?: string;
}

export default function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: SidebarProps) {
  return (
    <aside className={cn("py-4", className)}>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(null)}
          >
            All Posts
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
