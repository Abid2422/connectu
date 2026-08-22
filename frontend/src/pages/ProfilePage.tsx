import { Link } from 'react-router-dom';
import PhotoUploadSection from '../components/profile/PhotoUploadSection';

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
        <Link to="/discovery" className="text-sm text-foreground/50 hover:text-foreground/70">
          ← Back
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground">Your photos</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Add a main photo and up to 3 more so other students recognize you.
        </p>
        <div className="mt-6">
          <PhotoUploadSection />
        </div>
      </div>
    </main>
  );
}
