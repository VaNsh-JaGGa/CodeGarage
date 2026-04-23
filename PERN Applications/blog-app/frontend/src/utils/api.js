const API_BASE_URL = "http://localhost:5000/api"; 
const API_ORIGIN = new URL(API_BASE_URL).origin;

let apiToken = "";

export const setApiToken = (token) => {
  apiToken = token || "";
};

export const getToken = () => apiToken;

export const getBlogCardData = (blog) => {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.content,
    category: blog.category || "General",
    image: blog.image_url ? `${API_ORIGIN}${blog.image_url}` : "",
    date: new Date(blog.createdAt).toDateString(),
    author: blog.author?.username || "Unknown",
    userId: blog.userId,
    likeCount: blog.likeCount || 0,
    dislikeCount: blog.dislikeCount || 0,
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};