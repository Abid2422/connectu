const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Mirrors the backend's Prisma User model as returned over JSON — Date
// fields are serialized to ISO strings, not native Date objects.
export interface User {
  id: string;
  nyuEmail: string;
  emailVerified: boolean;
  name: string | null;
  major: string | null;
  year: string | null;
  bio: string | null;
  interests: string[];
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  error: string;
}

interface MessageResponse {
  message: string;
}

interface VerifyOtpResponse {
  user: User;
}

interface MeResponse {
  user: User;
}

// Mirrors backend/src/middleware/validate.middleware.ts's expected body shapes.
interface SignupRequestBody {
  nyuEmail: string;
}

interface VerifyOtpRequestBody {
  nyuEmail: string;
  otpCode: string;
}

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return data as TResponse;
}

export function signup(nyuEmail: string): Promise<MessageResponse> {
  const body: SignupRequestBody = { nyuEmail };
  return postJson<MessageResponse>('/api/auth/signup', body);
}

export function verifyOtp(nyuEmail: string, otpCode: string): Promise<VerifyOtpResponse> {
  const body: VerifyOtpRequestBody = { nyuEmail, otpCode };
  return postJson<VerifyOtpResponse>('/api/auth/verify-otp', body);
}

export function resendOtp(nyuEmail: string): Promise<MessageResponse> {
  const body: SignupRequestBody = { nyuEmail };
  return postJson<MessageResponse>('/api/auth/resend-otp', body);
}

// GET /api/users/me — resolves to the logged-in user, or null if there's no
// valid session. A 401 is the expected "not logged in" response here, so it
// resolves to null rather than throwing; other failures (network, 5xx) still
// throw since those aren't a normal "logged out" state.
export async function getMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    return null;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return (data as MeResponse).user;
}
