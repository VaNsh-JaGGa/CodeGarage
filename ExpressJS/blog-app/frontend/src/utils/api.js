const API_BASE_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

export const saveLogin = (data) => {
  localStorage.setItem("token", data.token || "");
  localStorage.setItem("userId", String(data.userId || ""));
  localStorage.setItem("username", data.username || "");
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
};

export const checkLogin = () => {
  return Boolean(localStorage.getItem("token"));
};

export const getBlogCardData = (blog) => {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.content,
    category: blog.category || "General",
    image: blog.image_url || "",
    date: new Date(blog.createdAt).toDateString(),
    author: blog.author?.username || "Unknown",
    userId: blog.userId,
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

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
