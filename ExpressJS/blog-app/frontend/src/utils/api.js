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

export const apiRequest = async (endpoint, options = {}) => { // options provide the body and method of an api request and headers if needed to give forward
  console.log("endpoint here");
  console.log(endpoint);
  console.log(options)
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}), // if users had give the header put it into the headers object
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers, // the header in the options will be overrided by this.
  });

  console.log("first is options and second is headers");
  console.log(options);
  console.log(headers);

  console.log("Helo I am Ressss");
  console.log(response);
  
  const data = await response.json().catch(() => ({}));
  console.log(data);
  
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
