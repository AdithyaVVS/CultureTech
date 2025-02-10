import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, categorySchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Posts
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get("/api/posts/category/:category", async (req, res) => {
    const result = categorySchema.safeParse(req.params.category);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const posts = await storage.getPostsByCategory(result.data);
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPostById(Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const post = await storage.createPost({
      ...result.data,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  });

  // Comments
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.getCommentsByPostId(Number(req.params.postId));
    res.json(comments);
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const result = insertCommentSchema.safeParse({
      ...req.body,
      postId: Number(req.params.postId),
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const comment = await storage.createComment({
      ...result.data,
      authorId: req.user.id,
    });
    res.status(201).json(comment);
  });

  // Bookmarks
  app.post("/api/bookmarks/:postId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const bookmark = await storage.createBookmark({
      userId: req.user.id,
      postId: Number(req.params.postId),
    });
    res.status(201).json(bookmark);
  });

  app.delete("/api/bookmarks/:postId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    await storage.deleteBookmark(req.user.id, Number(req.params.postId));
    res.sendStatus(200);
  });

  app.get("/api/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const bookmarks = await storage.getBookmarksByUserId(req.user.id);
    res.json(bookmarks);
  });

  const httpServer = createServer(app);
  return httpServer;
}
