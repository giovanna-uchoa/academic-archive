const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.CMS_PORT || 4000);
const ADMIN_TOKEN = process.env.CMS_ADMIN_TOKEN || 'admin';

const contentDir = path.join(__dirname, 'content');
const subjectsPath = path.join(contentDir, 'subjects.json');
const postsPath = path.join(contentDir, 'posts.json');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function ensureContentFiles() {
  await fs.mkdir(contentDir, { recursive: true });

  for (const filePath of [subjectsPath, postsPath]) {
    try {
      await fs.access(filePath);
    } catch {
      await writeJson(filePath, []);
    }
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return token && token === ADMIN_TOKEN;
}

function sanitizeSubject(input) {
  return {
    id: String(input.id || '').trim(),
    title: String(input.title || '').trim(),
    description: String(input.description || '').trim(),
    overview: String(input.overview || '').trim(),
    icon: String(input.icon || '').trim(),
  };
}

function sanitizePost(input) {
  return {
    id: Number(input.id || 0),
    title: String(input.title || '').trim(),
    excerpt: String(input.excerpt || '').trim(),
    content: String(input.content || '').trim(),
    date: String(input.date || '').trim(),
    timeSpent: String(input.timeSpent || '').trim(),
    subjectId: String(input.subjectId || '').trim(),
  };
}

function validateSubject(subject) {
  return Boolean(subject.id && subject.title && subject.description);
}

function validatePost(post) {
  return Boolean(post.title && post.excerpt && post.content && post.date && post.subjectId);
}

function nextPostId(posts) {
  return posts.reduce((max, post) => Math.max(max, Number(post.id) || 0), 0) + 1;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname === '/api/health' && req.method === 'GET') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname === '/api/subjects' && req.method === 'GET') {
      const subjects = await readJson(subjectsPath);
      sendJson(res, 200, subjects);
      return;
    }

    if (pathname === '/api/posts' && req.method === 'GET') {
      const posts = await readJson(postsPath);
      sendJson(res, 200, posts);
      return;
    }

    if (!isAuthorized(req)) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }

    if (pathname === '/api/subjects' && req.method === 'POST') {
      const subjects = await readJson(subjectsPath);
      const payload = sanitizeSubject(await parseBody(req));

      if (!validateSubject(payload)) {
        sendJson(res, 400, { message: 'Missing required subject fields' });
        return;
      }

      if (subjects.some(subject => subject.id === payload.id)) {
        sendJson(res, 409, { message: 'Subject id already exists' });
        return;
      }

      subjects.push(payload);
      await writeJson(subjectsPath, subjects);
      sendJson(res, 201, payload);
      return;
    }

    if (pathname.startsWith('/api/subjects/') && req.method === 'PUT') {
      const subjectId = pathname.replace('/api/subjects/', '');
      const subjects = await readJson(subjectsPath);
      const index = subjects.findIndex(subject => subject.id === subjectId);

      if (index === -1) {
        sendJson(res, 404, { message: 'Subject not found' });
        return;
      }

      const payload = sanitizeSubject(await parseBody(req));
      if (!validateSubject(payload)) {
        sendJson(res, 400, { message: 'Missing required subject fields' });
        return;
      }

      if (payload.id !== subjectId && subjects.some(subject => subject.id === payload.id)) {
        sendJson(res, 409, { message: 'Subject id already exists' });
        return;
      }

      const previousId = subjects[index].id;
      subjects[index] = payload;
      await writeJson(subjectsPath, subjects);

      if (previousId !== payload.id) {
        const posts = await readJson(postsPath);
        const syncedPosts = posts.map(post =>
          post.subjectId === previousId ? { ...post, subjectId: payload.id } : post
        );
        await writeJson(postsPath, syncedPosts);
      }

      sendJson(res, 200, payload);
      return;
    }

    if (pathname.startsWith('/api/subjects/') && req.method === 'DELETE') {
      const subjectId = pathname.replace('/api/subjects/', '');
      const subjects = await readJson(subjectsPath);
      const filteredSubjects = subjects.filter(subject => subject.id !== subjectId);

      if (filteredSubjects.length === subjects.length) {
        sendJson(res, 404, { message: 'Subject not found' });
        return;
      }

      await writeJson(subjectsPath, filteredSubjects);

      const posts = await readJson(postsPath);
      const filteredPosts = posts.filter(post => post.subjectId !== subjectId);
      await writeJson(postsPath, filteredPosts);

      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname === '/api/posts' && req.method === 'POST') {
      const posts = await readJson(postsPath);
      const payload = sanitizePost(await parseBody(req));

      if (!validatePost(payload)) {
        sendJson(res, 400, { message: 'Missing required post fields' });
        return;
      }

      payload.id = nextPostId(posts);
      posts.push(payload);
      await writeJson(postsPath, posts);

      sendJson(res, 201, payload);
      return;
    }

    if (pathname.startsWith('/api/posts/') && req.method === 'PUT') {
      const postId = Number(pathname.replace('/api/posts/', ''));
      const posts = await readJson(postsPath);
      const index = posts.findIndex(post => Number(post.id) === postId);

      if (index === -1) {
        sendJson(res, 404, { message: 'Post not found' });
        return;
      }

      const payload = sanitizePost(await parseBody(req));
      if (!validatePost(payload)) {
        sendJson(res, 400, { message: 'Missing required post fields' });
        return;
      }

      payload.id = postId;
      posts[index] = payload;
      await writeJson(postsPath, posts);

      sendJson(res, 200, payload);
      return;
    }

    if (pathname.startsWith('/api/posts/') && req.method === 'DELETE') {
      const postId = Number(pathname.replace('/api/posts/', ''));
      const posts = await readJson(postsPath);
      const filteredPosts = posts.filter(post => Number(post.id) !== postId);

      if (filteredPosts.length === posts.length) {
        sendJson(res, 404, { message: 'Post not found' });
        return;
      }

      await writeJson(postsPath, filteredPosts);
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { message: 'Not found' });
  } catch (error) {
    sendJson(res, 500, {
      message: 'Unexpected server error',
      error: error instanceof Error ? error.message : 'unknown',
    });
  }
});

ensureContentFiles()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`CMS API running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to start CMS server', error);
    process.exit(1);
  });
