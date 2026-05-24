import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import { dbHelper } from "../services/dbHelper.js";

const apiKey = process.env.OPENROUTER_API_KEY || "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";

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://openrouter.ai/api/v1"
});

// Helper to determine if current user is admin
const checkIsAdmin = async (userId) => {
  if (userId === "user_2yMX02PRbyMtQK6PebpjnxvRNIA") return true;
  try {
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role === 'admin') return true;
    if (user.primaryEmailAddress?.emailAddress?.includes('admin@quick.ai') || user.primaryEmailAddress?.emailAddress?.includes('admin@')) {
      return true;
    }
  } catch (err) {
    console.warn("Could not verify admin role from Clerk:", err.message);
  }
  return false;
};

// Helper to get Author information from Clerk
const getAuthorDetails = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Quick.ai Author",
      image: user.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    };
  } catch (err) {
    return {
      name: "Quick.ai Author",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    };
  }
};

// --- CONTROLLER HANDLERS ---

// GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category, sort, search, tag } = req.query;
    const blogs = await dbHelper.blogs.getAll({ category, sort, search, tag });
    
    // Fetch unique tags in the system for filtering
    const allTags = [...new Set(blogs.flatMap(b => b.tags || []))].slice(0, 15);

    res.json({ success: true, blogs, tags: allTags });
  } catch (error) {
    console.error("getAllBlogs error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth?.userId;

    const blog = await dbHelper.blogs.getById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Increment views
    await dbHelper.blogs.incrementViews(id);
    blog.views_count = (blog.views_count || 0) + 1;

    // Fetch details
    const comments = await dbHelper.comments.getByBlogId(id);
    const ratings = await dbHelper.ratings.getByBlogId(id);
    
    // Fetch related blogs (same category, sorted by latest, max 3)
    const allBlogs = await dbHelper.blogs.getAll({ category: blog.category });
    const related = allBlogs
      .filter(b => b.id !== blog.id)
      .slice(0, 3);

    // Check if liked and bookmarked
    const liked = await dbHelper.likes.hasLiked(id, userId);
    const bookmarked = await dbHelper.bookmarks.hasBookmarked(id, userId);

    res.json({
      success: true,
      blog,
      comments,
      ratings,
      related,
      liked,
      bookmarked
    });
  } catch (error) {
    console.error("getBlogById error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { title, thumbnail, description, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.json({ success: false, message: "Title, content, and category are required." });
    }

    // Get author details
    const author = await getAuthorDetails(userId);

    const newBlog = await dbHelper.blogs.create({
      title,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      description: description || title,
      content,
      category,
      tags: tags || [],
      author_id: userId,
      author_name: author.name,
      author_image: author.image
    });

    res.json({ success: true, blog: newBlog, message: "Blog posted successfully!" });
  } catch (error) {
    console.error("createBlog error:", error);
    res.json({ success: false, message: error.message });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const { title, thumbnail, description, content, category, tags } = req.body;

    const blog = await dbHelper.blogs.getById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (blog.author_id !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden: You are not the owner of this blog." });
    }

    const updatedBlog = await dbHelper.blogs.update(id, {
      title,
      thumbnail,
      description,
      content,
      category,
      tags
    });

    res.json({ success: true, blog: updatedBlog, message: "Blog updated successfully!" });
  } catch (error) {
    console.error("updateBlog error:", error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const blog = await dbHelper.blogs.getById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (blog.author_id !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await dbHelper.blogs.delete(id);
    res.json({ success: true, message: "Blog deleted successfully." });
  } catch (error) {
    console.error("deleteBlog error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/:id/like
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const blog = await dbHelper.blogs.getById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const result = await dbHelper.likes.toggle(id, userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("likeBlog error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/:id/bookmark
export const bookmarkBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const blog = await dbHelper.blogs.getById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const result = await dbHelper.bookmarks.toggle(id, userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("bookmarkBlog error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blogs/bookmarked
export const getBookmarkedBlogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const blogs = await dbHelper.bookmarks.getBookmarkedBlogs(userId);
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("getBookmarkedBlogs error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/:id/comments
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const { parent_id, content } = req.body;

    if (!content) {
      return res.json({ success: false, message: "Comment content is required." });
    }

    const author = await getAuthorDetails(userId);

    const newComment = await dbHelper.comments.add(id, {
      parent_id,
      user_id: userId,
      author_name: author.name,
      author_image: author.image,
      content
    });

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("addComment error:", error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.auth;

    const comments = await dbHelper.stats.getAllCommentsGlobal();
    const comment = comments.find(c => c.id === parseInt(commentId));
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    const blog = await dbHelper.blogs.getById(comment.blog_id);
    const isAdmin = await checkIsAdmin(userId);

    // Can delete if owner of comment, owner of blog, or admin
    if (comment.user_id !== userId && (!blog || blog.author_id !== userId) && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await dbHelper.comments.delete(commentId);
    res.json({ success: true, message: "Comment deleted successfully." });
  } catch (error) {
    console.error("deleteComment error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/:id/rate
export const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid rating. Must be between 1 and 5." });
    }

    const result = await dbHelper.ratings.add(id, {
      user_id: userId,
      rating,
      review: review || ""
    });

    res.json({ success: true, ...result, message: "Review submitted successfully!" });
  } catch (error) {
    console.error("addRating error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/newsletter
export const newsletterSubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required." });
    }
    await dbHelper.subscribers.subscribe(email);
    res.json({ success: true, message: "Successfully subscribed to Quick.ai newsletter!" });
  } catch (error) {
    console.error("newsletterSubscribe error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blogs/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin panel is restricted." });
    }

    const stats = await dbHelper.stats.getAdminStats();
    const comments = await dbHelper.stats.getAllCommentsGlobal();
    const categories = await dbHelper.categories.getAll();
    const subscribers = await dbHelper.subscribers.getAll();
    const allBlogs = await dbHelper.blogs.getAll({});

    res.json({
      success: true,
      stats,
      comments,
      categories,
      subscribers,
      blogs: allBlogs
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/categories
export const createCategory = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name } = req.body;
    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (!name) {
      return res.json({ success: false, message: "Name is required." });
    }
    const cat = await dbHelper.categories.create(name);
    res.json({ success: true, category: cat });
  } catch (error) {
    console.error("createCategory error:", error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await dbHelper.categories.delete(id);
    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blogs/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await dbHelper.categories.getAll();
    res.json({ success: true, categories });
  } catch (error) {
    console.error("getCategories error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/blogs/author/list
export const getMyBlogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const blogs = await dbHelper.blogs.getByAuthor(userId);
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("getMyBlogs error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/blogs/ai/generate
export const generateBlogAI = async (req, res) => {
  try {
    const { topic, image } = req.body;

    if (!topic && !image) {
      return res.json({ success: false, message: "Provide either a topic or an image to generate blog contents." });
    }

    let completion;
    let systemPrompt = `You are a creative, professional writer for Quick.ai, a futuristic and modern AI-powered tech platform. 
Write a high-quality, engaging blog post. 
Return your response EXACTLY as a JSON object matching this structure:
{
  "title": "A captivating, SEO-optimized title",
  "description": "A snappy and interesting 2-sentence summary of the blog post",
  "content": "A detailed, rich, multi-paragraph blog article (at least 450 words) written in HTML. Include section headers <h2>, paragraph tags <p>, lists <ul>/<li>, and emphasis <strong> to make it beautiful and styled.",
  "category": "Suggested category (must be one of: AI & Machine Learning, Web Development, Design & UX, Technology Trends)",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}
Do NOT return any other text, markdown blocks, or headers like \`\`\`json. Return pure JSON output.`;

    if (image) {
      // Analyze image (base64) and topic
      console.log("Analyzing image and generating blog with AI...");
      
      // Clean base64 prefix
      let base64Data = image;
      let mimeType = "image/png";
      if (image.startsWith("data:")) {
        const parts = image.split(";base64,");
        mimeType = parts[0].split(":")[1];
        base64Data = parts[1];
      }

      completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${systemPrompt}\n\nAdditional user prompt/topic description: ${topic || "Analyze this image and write a stunning blog post about it."}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`
                }
              }
            ]
          }
        ]
      });
    } else {
      // Generate from text topic only
      console.log("Generating blog from text prompt with AI...");
      completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nGenerate a blog post about this topic: "${topic}"`
          }
        ]
      });
    }

    let textResponse = completion.choices[0].message.content.trim();
    console.log("AI completion finished. Response length:", textResponse.length);

    // Strip markdown formatting if returned
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.substring(7);
    } else if (textResponse.startsWith("```")) {
      textResponse = textResponse.substring(3);
    }
    if (textResponse.endsWith("```")) {
      textResponse = textResponse.substring(0, textResponse.length - 3);
    }

    const blogJson = JSON.parse(textResponse.trim());
    res.json({ success: true, blog: blogJson });

  } catch (error) {
    console.error("generateBlogAI error:", error);
    res.json({ success: false, message: `AI Generation failed: ${error.message}` });
  }
};
