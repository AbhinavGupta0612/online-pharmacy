const API_BASE = 'http://localhost:5000/api';

export async function post(path, body = {}, token) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function get(path) {
  const res = await fetch(API_BASE + path);
  return res.json();
}
