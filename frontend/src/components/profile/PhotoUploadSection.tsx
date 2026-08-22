import { useRef, useState, type ChangeEvent } from 'react';
import { uploadAvatar, addPhoto, removePhoto } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

// Mirrors backend/src/middleware/upload.middleware.ts's constants.
const ALLOWED_TYPES = 'image/jpeg,image/png,image/webp';
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_ADDITIONAL_PHOTOS = 3;

export default function PhotoUploadSection() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const photoUrls = user.photoUrls;

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.split(',').includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed.';
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return 'Photo must be 5MB or smaller.';
    }
    return null;
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const updatedUser = await uploadAvatar(file);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function handleAddPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const updatedUser = await addPhoto(file);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemovePhoto(index: number) {
    setError(null);
    setBusy(true);
    try {
      const updatedUser = await removePhoto(index);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">Main photo</span>
        <div className="flex items-center gap-4">
          <UserAvatar
            userId={user.id}
            name={user.name}
            nyuEmail={user.nyuEmail}
            photoUrl={user.avatarUrl}
            size={72}
          />
          <div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={busy}
              className="rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-foreground/70 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {user.avatarUrl ? 'Replace photo' : 'Add photo'}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept={ALLOWED_TYPES}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">Additional photos</span>
        <div className="grid grid-cols-3 gap-3">
          {photoUrls.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-secondary">
              <img src={url} alt={`Additional photo ${index + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                disabled={busy}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ×
              </button>
            </div>
          ))}

          {photoUrls.length < MAX_ADDITIONAL_PHOTOS && (
            <button
              type="button"
              onClick={() => addInputRef.current?.click()}
              disabled={busy}
              className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-secondary text-2xl text-foreground/40 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              +
            </button>
          )}
          <input ref={addInputRef} type="file" accept={ALLOWED_TYPES} onChange={handleAddPhoto} className="hidden" />
        </div>
        <p className="mt-1.5 text-xs text-foreground/50">
          {photoUrls.length}/{MAX_ADDITIONAL_PHOTOS} added
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
