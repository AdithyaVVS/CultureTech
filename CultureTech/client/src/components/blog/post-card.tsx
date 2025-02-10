import { Post } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        {post.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <span>{post.category}</span>
            <time>{format(new Date(post.createdAt), "MMM d, yyyy")}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}