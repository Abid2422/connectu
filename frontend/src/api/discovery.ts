import { API_BASE_URL, type ErrorResponse } from './auth';

// Subset of User exposed by GET /api/discover — see
// backend/src/controllers/discovery.controller.ts's PUBLIC_PROFILE_SELECT
// for what's deliberately left out (email, verification, timestamps, etc.).
export interface Candidate {
  id: string;
  name: string | null;
  major: string | null;
  year: string | null;
  campus: string | null;
  bio: string | null;
  interests: string[];
  avatarUrl: string | null;
}

interface DiscoverResponse {
  candidates: Candidate[];
}

export interface DiscoverFilters {
  major?: string;
  year?: string;
}

export async function getDiscoverCandidates(filters: DiscoverFilters = {}): Promise<Candidate[]> {
  const params = new URLSearchParams();
  if (filters.major) params.set('major', filters.major);
  if (filters.year) params.set('year', filters.year);

  const query = params.toString();
  const res = await fetch(`${API_BASE_URL}/api/discover${query ? `?${query}` : ''}`, {
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return (data as DiscoverResponse).candidates;
}

export type SwipeDirection = 'like' | 'pass';

interface SwipeResponse {
  matched: boolean;
}

// POST /api/swipes — returns whether this swipe completed a mutual match.
export async function submitSwipe(swipedId: string, direction: SwipeDirection): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/swipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ swipedId, direction }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as ErrorResponse).error || 'Request failed');
  }

  return (data as SwipeResponse).matched;
}
