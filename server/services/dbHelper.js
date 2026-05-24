import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from '../configs/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, '..', 'data', 'blogs_db.json');

let usePostgres = false;

// Fallback JSON-based database in-memory cache
let jsonDb = {
  categories: [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Health' },
    { id: 3, name: 'Insurance' },
    { id: 4, name: 'Lifestyle' },
    { id: 5, name: 'Travel' },
    { id: 6, name: 'Food' },
    { id: 7, name: 'AI & Machine Learning' },
    { id: 8, name: 'Web Development' },
    { id: 9, name: 'Design & UX' },
    { id: 10, name: 'Finance' },
    { id: 11, name: 'Startup' },
    { id: 12, name: 'Cyber Security' },
    { id: 13, name: 'Education' },
    { id: 14, name: 'Photography' },
    { id: 15, name: 'Sports' },
    { id: 16, name: 'Entertainment' }
  ],
  blogs: [],
  likes: [],
  bookmarks: [],
  comments: [],
  ratings: [],
  subscribers: []
};

// Initialize JSON database
const loadJsonDb = () => {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
      jsonDb = JSON.parse(data);
      console.log('📦 Loaded JSON Database fallback from:', DB_FILE_PATH);
    } else {
      saveJsonDb();
      console.log('📦 Created fresh JSON Database fallback at:', DB_FILE_PATH);
    }
  } catch (err) {
    console.error('❌ Failed to load JSON database fallback:', err.message);
  }
};

const saveJsonDb = () => {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(jsonDb, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Failed to save JSON database fallback:', err.message);
  }
};

// Initialize Database (attempt PG, fallback to JSON)
export const initDb = async () => {
  try {
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await sql`SELECT 1`;
    usePostgres = true;
    console.log('✅ Connected to Neon PostgreSQL successfully!');

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumbnail TEXT,
        description TEXT,
        content TEXT,
        category VARCHAR(255) NOT NULL,
        tags TEXT[],
        author_id VARCHAR(255) NOT NULL,
        author_name VARCHAR(255),
        author_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes_count INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        views_count INT DEFAULT 0,
        rating NUMERIC(3, 2) DEFAULT 0,
        rating_count INT DEFAULT 0
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_likes (
        id SERIAL PRIMARY KEY,
        blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        UNIQUE(blog_id, user_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_bookmarks (
        id SERIAL PRIMARY KEY,
        blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        UNIQUE(blog_id, user_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id SERIAL PRIMARY KEY,
        blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
        parent_id INT REFERENCES blog_comments(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        author_name VARCHAR(255),
        author_image TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_ratings (
        id SERIAL PRIMARY KEY,
        blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(blog_id, user_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seed default categories
    const countCats = await sql`SELECT count(*) FROM blog_categories`;
    if (parseInt(countCats[0].count) === 0) {
      await sql`
        INSERT INTO blog_categories (name) VALUES 
        ('Technology'),
        ('Health'),
        ('Insurance'),
        ('Lifestyle'),
        ('Travel'),
        ('Food'),
        ('AI & Machine Learning'),
        ('Web Development'),
        ('Design & UX'),
        ('Finance'),
        ('Startup'),
        ('Cyber Security'),
        ('Education'),
        ('Photography'),
        ('Sports'),
        ('Entertainment')
      `;
    }

    console.log('🗂️ PostgreSQL Database tables initialized/verified.');
  } catch (error) {
    usePostgres = false;
    console.warn('⚠️ Neon PostgreSQL connection failed. Falling back to local JSON database.');
  }
};

// Start initialization immediately
loadJsonDb();
initDb();

// High level db helper operations
export const dbHelper = {
  // --- CATEGORIES ---
  categories: {
    getAll: async () => {
      if (usePostgres) {
        return await sql`SELECT * FROM blog_categories ORDER BY name ASC`;
      } else {
        return jsonDb.categories;
      }
    },
    create: async (name) => {
      if (usePostgres) {
        const res = await sql`INSERT INTO blog_categories (name) VALUES (${name}) RETURNING *`;
        return res[0];
      } else {
        const id = jsonDb.categories.length > 0 ? Math.max(...jsonDb.categories.map(c => c.id)) + 1 : 1;
        const newCat = { id, name };
        jsonDb.categories.push(newCat);
        saveJsonDb();
        return newCat;
      }
    },
    delete: async (id) => {
      if (usePostgres) {
        await sql`DELETE FROM blog_categories WHERE id = ${id}`;
        return true;
      } else {
        jsonDb.categories = jsonDb.categories.filter(c => c.id !== parseInt(id));
        saveJsonDb();
        return true;
      }
    }
  },

  // --- BLOGS ---
  blogs: {
    getAll: async ({ category, sort, search, tag }) => {
      if (usePostgres) {
        let query = sql`SELECT * FROM blogs WHERE 1=1`;
        if (category && category !== 'All') {
          query = sql`${query} AND category = ${category}`;
        }
        if (search) {
          const searchPattern = `%${search}%`;
          query = sql`${query} AND (title ILIKE ${searchPattern} OR description ILIKE ${searchPattern} OR content ILIKE ${searchPattern})`;
        }
        if (tag) {
          query = sql`${query} AND ${tag} = ANY(tags)`;
        }

        // Apply sorting
        if (sort === 'Most liked') {
          query = sql`${query} ORDER BY likes_count DESC, created_at DESC`;
        } else if (sort === 'Trending') {
          query = sql`${query} ORDER BY views_count DESC, likes_count DESC`;
        } else if (sort === 'Most viewed') {
          query = sql`${query} ORDER BY views_count DESC`;
        } else {
          // Default: Latest
          query = sql`${query} ORDER BY created_at DESC`;
        }
        return await query;
      } else {
        let results = [...jsonDb.blogs];

        if (category && category !== 'All') {
          results = results.filter(b => b.category === category);
        }
        if (search) {
          const term = search.toLowerCase();
          results = results.filter(b => 
            (b.title || '').toLowerCase().includes(term) || 
            (b.description || '').toLowerCase().includes(term) || 
            (b.content || '').toLowerCase().includes(term)
          );
        }
        if (tag) {
          results = results.filter(b => b.tags && b.tags.includes(tag));
        }

        // Sorting
        if (sort === 'Most liked') {
          results.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0) || new Date(b.created_at) - new Date(a.created_at));
        } else if (sort === 'Trending') {
          results.sort((a, b) => ((b.views_count || 0) + (b.likes_count || 0)) - ((a.views_count || 0) + (a.likes_count || 0)));
        } else if (sort === 'Most viewed') {
          results.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        } else {
          results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return results;
      }
    },
    getById: async (id) => {
      const idInt = parseInt(id);
      if (usePostgres) {
        const res = await sql`SELECT * FROM blogs WHERE id = ${idInt}`;
        return res[0] || null;
      } else {
        return jsonDb.blogs.find(b => b.id === idInt) || null;
      }
    },
    getByAuthor: async (authorId) => {
      if (usePostgres) {
        return await sql`SELECT * FROM blogs WHERE author_id = ${authorId} ORDER BY created_at DESC`;
      } else {
        return jsonDb.blogs.filter(b => b.author_id === authorId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },
    create: async (blogData) => {
      const { title, thumbnail, description, content, category, tags, author_id, author_name, author_image } = blogData;
      const cleanTags = Array.isArray(tags) ? tags : [];
      if (usePostgres) {
        const res = await sql`
          INSERT INTO blogs 
          (title, thumbnail, description, content, category, tags, author_id, author_name, author_image)
          VALUES 
          (${title}, ${thumbnail}, ${description}, ${content}, ${category}, ${cleanTags}, ${author_id}, ${author_name}, ${author_image})
          RETURNING *
        `;
        return res[0];
      } else {
        const id = jsonDb.blogs.length > 0 ? Math.max(...jsonDb.blogs.map(b => b.id)) + 1 : 1;
        const newBlog = {
          id,
          title,
          thumbnail,
          description,
          content,
          category,
          tags: cleanTags,
          author_id,
          author_name,
          author_image,
          created_at: new Date().toISOString(),
          likes_count: 0,
          comments_count: 0,
          views_count: 0,
          rating: 0,
          rating_count: 0
        };
        jsonDb.blogs.push(newBlog);
        saveJsonDb();
        return newBlog;
      }
    },
    update: async (id, blogData) => {
      const idInt = parseInt(id);
      const { title, thumbnail, description, content, category, tags } = blogData;
      const cleanTags = Array.isArray(tags) ? tags : [];

      if (usePostgres) {
        const res = await sql`
          UPDATE blogs 
          SET title = ${title}, thumbnail = ${thumbnail}, description = ${description}, 
              content = ${content}, category = ${category}, tags = ${cleanTags}
          WHERE id = ${idInt}
          RETURNING *
        `;
        return res[0];
      } else {
        const idx = jsonDb.blogs.findIndex(b => b.id === idInt);
        if (idx !== -1) {
          jsonDb.blogs[idx] = {
            ...jsonDb.blogs[idx],
            title,
            thumbnail,
            description,
            content,
            category,
            tags: cleanTags
          };
          saveJsonDb();
          return jsonDb.blogs[idx];
        }
        return null;
      }
    },
    delete: async (id) => {
      const idInt = parseInt(id);
      if (usePostgres) {
        await sql`DELETE FROM blogs WHERE id = ${idInt}`;
        return true;
      } else {
        jsonDb.blogs = jsonDb.blogs.filter(b => b.id !== idInt);
        jsonDb.comments = jsonDb.comments.filter(c => c.blog_id !== idInt);
        jsonDb.likes = jsonDb.likes.filter(l => l.blog_id !== idInt);
        jsonDb.bookmarks = jsonDb.bookmarks.filter(b => b.blog_id !== idInt);
        jsonDb.ratings = jsonDb.ratings.filter(r => r.blog_id !== idInt);
        saveJsonDb();
        return true;
      }
    },
    incrementViews: async (id) => {
      const idInt = parseInt(id);
      if (usePostgres) {
        await sql`UPDATE blogs SET views_count = views_count + 1 WHERE id = ${idInt}`;
        return true;
      } else {
        const blog = jsonDb.blogs.find(b => b.id === idInt);
        if (blog) {
          blog.views_count = (blog.views_count || 0) + 1;
          saveJsonDb();
        }
        return true;
      }
    }
  },

  // --- LIKES ---
  likes: {
    toggle: async (blogId, userId) => {
      const blogIdInt = parseInt(blogId);
      if (usePostgres) {
        const existing = await sql`SELECT * FROM blog_likes WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
        let liked = false;
        if (existing.length > 0) {
          await sql`DELETE FROM blog_likes WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
          await sql`UPDATE blogs SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ${blogIdInt}`;
        } else {
          await sql`INSERT INTO blog_likes (blog_id, user_id) VALUES (${blogIdInt}, ${userId})`;
          await sql`UPDATE blogs SET likes_count = likes_count + 1 WHERE id = ${blogIdInt}`;
          liked = true;
        }
        const updated = await sql`SELECT likes_count FROM blogs WHERE id = ${blogIdInt}`;
        return { liked, likes_count: updated[0]?.likes_count || 0 };
      } else {
        const index = jsonDb.likes.findIndex(l => l.blog_id === blogIdInt && l.user_id === userId);
        const blog = jsonDb.blogs.find(b => b.id === blogIdInt);
        let liked = false;

        if (index !== -1) {
          jsonDb.likes.splice(index, 1);
          if (blog) blog.likes_count = Math.max(0, (blog.likes_count || 0) - 1);
        } else {
          const id = jsonDb.likes.length > 0 ? Math.max(...jsonDb.likes.map(l => l.id)) + 1 : 1;
          jsonDb.likes.push({ id, blog_id: blogIdInt, user_id: userId });
          if (blog) blog.likes_count = (blog.likes_count || 0) + 1;
          liked = true;
        }
        saveJsonDb();
        return { liked, likes_count: blog ? blog.likes_count : 0 };
      }
    },
    hasLiked: async (blogId, userId) => {
      const blogIdInt = parseInt(blogId);
      if (!userId) return false;
      if (usePostgres) {
        const res = await sql`SELECT 1 FROM blog_likes WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
        return res.length > 0;
      } else {
        return jsonDb.likes.some(l => l.blog_id === blogIdInt && l.user_id === userId);
      }
    }
  },

  // --- BOOKMARKS ---
  bookmarks: {
    toggle: async (blogId, userId) => {
      const blogIdInt = parseInt(blogId);
      if (usePostgres) {
        const existing = await sql`SELECT * FROM blog_bookmarks WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
        let bookmarked = false;
        if (existing.length > 0) {
          await sql`DELETE FROM blog_bookmarks WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
        } else {
          await sql`INSERT INTO blog_bookmarks (blog_id, user_id) VALUES (${blogIdInt}, ${userId})`;
          bookmarked = true;
        }
        return { bookmarked };
      } else {
        const index = jsonDb.bookmarks.findIndex(b => b.blog_id === blogIdInt && b.user_id === userId);
        let bookmarked = false;

        if (index !== -1) {
          jsonDb.bookmarks.splice(index, 1);
        } else {
          const id = jsonDb.bookmarks.length > 0 ? Math.max(...jsonDb.bookmarks.map(b => b.id)) + 1 : 1;
          jsonDb.bookmarks.push({ id, blog_id: blogIdInt, user_id: userId });
          bookmarked = true;
        }
        saveJsonDb();
        return { bookmarked };
      }
    },
    hasBookmarked: async (blogId, userId) => {
      const blogIdInt = parseInt(blogId);
      if (!userId) return false;
      if (usePostgres) {
        const res = await sql`SELECT 1 FROM blog_bookmarks WHERE blog_id = ${blogIdInt} AND user_id = ${userId}`;
        return res.length > 0;
      } else {
        return jsonDb.bookmarks.some(b => b.blog_id === blogIdInt && b.user_id === userId);
      }
    },
    getBookmarkedBlogs: async (userId) => {
      if (usePostgres) {
        return await sql`
          SELECT b.* FROM blogs b
          INNER JOIN blog_bookmarks bm ON b.id = bm.blog_id
          WHERE bm.user_id = ${userId}
          ORDER BY bm.id DESC
        `;
      } else {
        const bookmarkedIds = jsonDb.bookmarks
          .filter(bm => bm.user_id === userId)
          .map(bm => bm.blog_id);
        return jsonDb.blogs.filter(b => bookmarkedIds.includes(b.id));
      }
    }
  },

  // --- COMMENTS ---
  comments: {
    getByBlogId: async (blogId) => {
      const blogIdInt = parseInt(blogId);
      if (usePostgres) {
        return await sql`SELECT * FROM blog_comments WHERE blog_id = ${blogIdInt} ORDER BY created_at ASC`;
      } else {
        return jsonDb.comments.filter(c => c.blog_id === blogIdInt).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
    },
    add: async (blogId, commentData) => {
      const blogIdInt = parseInt(blogId);
      const { parent_id, user_id, author_name, author_image, content } = commentData;
      const parentIdInt = parent_id ? parseInt(parent_id) : null;

      if (usePostgres) {
        const res = await sql`
          INSERT INTO blog_comments 
          (blog_id, parent_id, user_id, author_name, author_image, content)
          VALUES 
          (${blogIdInt}, ${parentIdInt}, ${user_id}, ${author_name}, ${author_image}, ${content})
          RETURNING *
        `;
        await sql`UPDATE blogs SET comments_count = comments_count + 1 WHERE id = ${blogIdInt}`;
        return res[0];
      } else {
        const id = jsonDb.comments.length > 0 ? Math.max(...jsonDb.comments.map(c => c.id)) + 1 : 1;
        const newComment = {
          id,
          blog_id: blogIdInt,
          parent_id: parentIdInt,
          user_id,
          author_name,
          author_image,
          content,
          created_at: new Date().toISOString()
        };
        jsonDb.comments.push(newComment);
        const blog = jsonDb.blogs.find(b => b.id === blogIdInt);
        if (blog) {
          blog.comments_count = (blog.comments_count || 0) + 1;
        }
        saveJsonDb();
        return newComment;
      }
    },
    delete: async (commentId) => {
      const commentIdInt = parseInt(commentId);
      if (usePostgres) {
        // Fetch comment to get blog_id for decrementing count
        const comment = await sql`SELECT blog_id FROM blog_comments WHERE id = ${commentIdInt}`;
        if (comment.length > 0) {
          const blogId = comment[0].blog_id;
          // Delete replies recursively (PostgreSQL cascade takes care if schema has it, or we do it manual. 
          // Our REFERENCES clause has ON DELETE CASCADE for parent_id in postgres comments.)
          await sql`DELETE FROM blog_comments WHERE id = ${commentIdInt}`;
          
          // Re-calculate comment count
          const newCount = await sql`SELECT count(*) FROM blog_comments WHERE blog_id = ${blogId}`;
          await sql`UPDATE blogs SET comments_count = ${parseInt(newCount[0].count)} WHERE id = ${blogId}`;
        }
        return true;
      } else {
        const comment = jsonDb.comments.find(c => c.id === commentIdInt);
        if (comment) {
          const blogId = comment.blog_id;
          
          // Helper to recursively get comment ids to delete
          const getReplyIds = (parentId) => {
            const replies = jsonDb.comments.filter(c => c.parent_id === parentId);
            let ids = replies.map(r => r.id);
            for (const r of replies) {
              ids = [...ids, ...getReplyIds(r.id)];
            }
            return ids;
          };

          const idsToDelete = [commentIdInt, ...getReplyIds(commentIdInt)];
          jsonDb.comments = jsonDb.comments.filter(c => !idsToDelete.includes(c.id));

          // Update blog comments count
          const blog = jsonDb.blogs.find(b => b.id === blogId);
          if (blog) {
            blog.comments_count = jsonDb.comments.filter(c => c.blog_id === blogId).length;
          }
          saveJsonDb();
        }
        return true;
      }
    }
  },

  // --- RATINGS & REVIEWS ---
  ratings: {
    getByBlogId: async (blogId) => {
      const blogIdInt = parseInt(blogId);
      if (usePostgres) {
        return await sql`SELECT * FROM blog_ratings WHERE blog_id = ${blogIdInt} ORDER BY created_at DESC`;
      } else {
        return jsonDb.ratings.filter(r => r.blog_id === blogIdInt).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },
    add: async (blogId, ratingData) => {
      const blogIdInt = parseInt(blogId);
      const { user_id, rating, review } = ratingData;

      if (usePostgres) {
        // Insert or update rating
        await sql`
          INSERT INTO blog_ratings (blog_id, user_id, rating, review)
          VALUES (${blogIdInt}, ${user_id}, ${rating}, ${review})
          ON CONFLICT (blog_id, user_id) 
          DO UPDATE SET rating = ${rating}, review = ${review}, created_at = CURRENT_TIMESTAMP
        `;

        // Update average rating on blog
        const stats = await sql`
          SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as rating_count 
          FROM blog_ratings 
          WHERE blog_id = ${blogIdInt}
        `;
        const avg = parseFloat(stats[0].avg_rating).toFixed(2);
        const count = parseInt(stats[0].rating_count);
        
        await sql`UPDATE blogs SET rating = ${avg}, rating_count = ${count} WHERE id = ${blogIdInt}`;
        return { rating: avg, rating_count: count };
      } else {
        let item = jsonDb.ratings.find(r => r.blog_id === blogIdInt && r.user_id === user_id);
        if (item) {
          item.rating = parseInt(rating);
          item.review = review;
          item.created_at = new Date().toISOString();
        } else {
          const id = jsonDb.ratings.length > 0 ? Math.max(...jsonDb.ratings.map(r => r.id)) + 1 : 1;
          jsonDb.ratings.push({
            id,
            blog_id: blogIdInt,
            user_id,
            rating: parseInt(rating),
            review,
            created_at: new Date().toISOString()
          });
        }

        // Update blog average
        const blogRatings = jsonDb.ratings.filter(r => r.blog_id === blogIdInt);
        const avg = blogRatings.reduce((sum, r) => sum + r.rating, 0) / (blogRatings.length || 1);
        const blog = jsonDb.blogs.find(b => b.id === blogIdInt);
        if (blog) {
          blog.rating = parseFloat(avg.toFixed(2));
          blog.rating_count = blogRatings.length;
        }
        saveJsonDb();
        return { rating: blog ? blog.rating : avg, rating_count: blogRatings.length };
      }
    }
  },

  // --- NEWSLETTER SUBSCRIBERS ---
  subscribers: {
    subscribe: async (email) => {
      if (usePostgres) {
        try {
          const res = await sql`INSERT INTO blog_subscribers (email) VALUES (${email}) RETURNING *`;
          return res[0];
        } catch (err) {
          // If already registered, return existing
          const existing = await sql`SELECT * FROM blog_subscribers WHERE email = ${email}`;
          return existing[0];
        }
      } else {
        const existing = jsonDb.subscribers.find(s => s.email === email);
        if (existing) return existing;
        
        const id = jsonDb.subscribers.length > 0 ? Math.max(...jsonDb.subscribers.map(s => s.id)) + 1 : 1;
        const newSub = { id, email, created_at: new Date().toISOString() };
        jsonDb.subscribers.push(newSub);
        saveJsonDb();
        return newSub;
      }
    },
    getAll: async () => {
      if (usePostgres) {
        return await sql`SELECT * FROM blog_subscribers ORDER BY created_at DESC`;
      } else {
        return jsonDb.subscribers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    }
  },

  // --- ADMIN STATS ---
  stats: {
    getAdminStats: async () => {
      if (usePostgres) {
        const blogsCount = await sql`SELECT count(*) FROM blogs`;
        const commentsCount = await sql`SELECT count(*) FROM blog_comments`;
        const subscribersCount = await sql`SELECT count(*) FROM blog_subscribers`;
        const totalViews = await sql`SELECT COALESCE(SUM(views_count), 0) as views FROM blogs`;
        
        // Return unique users who have blogged
        const activeUsersCount = await sql`SELECT COUNT(DISTINCT author_id) FROM blogs`;

        return {
          totalBlogs: parseInt(blogsCount[0].count),
          totalComments: parseInt(commentsCount[0].count),
          totalSubscribers: parseInt(subscribersCount[0].count),
          totalViews: parseInt(totalViews[0].views),
          activeUsers: parseInt(activeUsersCount[0].count)
        };
      } else {
        const totalViews = jsonDb.blogs.reduce((sum, b) => sum + (b.views_count || 0), 0);
        const activeUsers = new Set(jsonDb.blogs.map(b => b.author_id)).size;

        return {
          totalBlogs: jsonDb.blogs.length,
          totalComments: jsonDb.comments.length,
          totalSubscribers: jsonDb.subscribers.length,
          totalViews,
          activeUsers
        };
      }
    },
    
    // Admin raw cleanups
    getAllCommentsGlobal: async () => {
      if (usePostgres) {
        return await sql`
          SELECT c.*, b.title as blog_title FROM blog_comments c
          INNER JOIN blogs b ON c.blog_id = b.id
          ORDER BY c.created_at DESC
        `;
      } else {
        return jsonDb.comments.map(c => {
          const blog = jsonDb.blogs.find(b => b.id === c.blog_id);
          return {
            ...c,
            blog_title: blog ? blog.title : 'Deleted Blog'
          };
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    }
  }
};
