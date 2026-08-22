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
  campus: string | null;
  bio: string | null;
  interests: string[];
  lookingFor: string[];
  avatarUrl: string | null;
  photoUrls: string[];
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

interface UpdateMeResponse {
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

export interface ProfileUpdateRequestBody {
  name?: string;
  major: string;
  year: string;
  campus: string;
  interests: string[];
  lookingFor: string[];
  bio: string;
}

async function sendJson<TResponse>(
  method: 'POST' | 'PUT',
  path: string,
  body: unknown,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
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

function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return sendJson<TResponse>('POST', path, body);
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

// PUT /api/users/me — completes/updates the logged-in user's profile.
// A successful call always marks onboardingComplete true server-side.
export function updateMe(body: ProfileUpdateRequestBody): Promise<User> {
  return sendJson<UpdateMeResponse>('PUT', '/api/users/me', body).then((res) => res.user);
}

async function sendPhoto(method: 'PUT' | 'POST', path: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return (data as UpdateMeResponse).user;
}

// PUT /api/users/me/avatar — replaces the main profile photo.
export function uploadAvatar(file: File): Promise<User> {
  return sendPhoto('PUT', '/api/users/me/avatar', file);
}

// POST /api/users/me/photos — appends one additional photo (max 3).
export function addPhoto(file: File): Promise<User> {
  return sendPhoto('POST', '/api/users/me/photos', file);
}

// DELETE /api/users/me/photos/:index — removes one additional photo by its
// position in the array.
export async function removePhoto(index: number): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/users/me/photos/${index}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return (data as UpdateMeResponse).user;
}
