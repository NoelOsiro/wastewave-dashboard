import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getPosts() {
  const url = endpoints.post.list;

  if (!url || url.trim() === '') {
    console.warn('getPosts: Missing API endpoint URL');
    return { posts: [] };
  }

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
    console.error('getPosts failed:', err.message);
    return { posts: [] };
  }
}

// ----------------------------------------------------------------------

export async function getPost(title: string) {
  if (!title) {
    throw new Error('Post title is required');
  }

  const url = `${endpoints.post.details}?title=${encodeURIComponent(title)}`;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
    console.error('getPost failed:', err.message);
    throw new Error(`Failed to fetch post: ${err.message}`);
  }
}

// ----------------------------------------------------------------------

export async function getLatestPosts(title: string) {
  const URL = title ? `${endpoints.post.latest}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}
