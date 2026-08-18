import SignupForm from '../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Join ConnectU</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign up with your NYU email to get started.
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
