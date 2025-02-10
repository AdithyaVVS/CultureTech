import { User, Post, Comment, Bookmark, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Posts
  createPost(post: Omit<Post, "id" | "createdAt">): Promise<Post>;
  getPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostsByCategory(category: string): Promise<Post[]>;
  
  // Comments
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  
  // Bookmarks
  createBookmark(bookmark: Omit<Bookmark, "id">): Promise<Bookmark>;
  deleteBookmark(userId: number, postId: number): Promise<void>;
  getBookmarksByUserId(userId: number): Promise<Bookmark[]>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private bookmarks: Map<number, Bookmark>;
  private currentId: { [key: string]: number };
  readonly sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.bookmarks = new Map();
    this.currentId = { users: 1, posts: 1, comments: 1, bookmarks: 1 };
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      // Make the first user an admin for testing
      isAdmin: this.users.size === 0 
    };
    this.users.set(id, user);
    return user;
  }

  async createPost(post: Omit<Post, "id" | "createdAt">): Promise<Post> {
    const id = this.currentId.posts++;
    const newPost: Post = { ...post, id, createdAt: new Date() };
    this.posts.set(id, newPost);
    return newPost;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      (post) => post.category === category,
    );
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const id = this.currentId.comments++;
    const newComment: Comment = { ...comment, id, createdAt: new Date() };
    this.comments.set(id, newComment);
    return newComment;
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.postId === postId,
    );
  }

  async createBookmark(bookmark: Omit<Bookmark, "id">): Promise<Bookmark> {
    const id = this.currentId.bookmarks++;
    const newBookmark: Bookmark = { ...bookmark, id };
    this.bookmarks.set(id, newBookmark);
    return newBookmark;
  }

  async deleteBookmark(userId: number, postId: number): Promise<void> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      (b) => b.userId === userId && b.postId === postId,
    );
    if (bookmark) {
      this.bookmarks.delete(bookmark.id);
    }
  }

  async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId,
    );
  }
}

export const storage = new MemStorage();