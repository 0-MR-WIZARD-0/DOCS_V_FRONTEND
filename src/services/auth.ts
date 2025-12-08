export async function login(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Authorization error');
  }

  return res.json();
}
