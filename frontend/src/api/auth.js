const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function postJson(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function signup(nyuEmail) {
  return postJson('/api/auth/signup', { nyuEmail });
}

export function verifyOtp(nyuEmail, otpCode) {
  return postJson('/api/auth/verify-otp', { nyuEmail, otpCode });
}

export function resendOtp(nyuEmail) {
  return postJson('/api/auth/resend-otp', { nyuEmail });
}
