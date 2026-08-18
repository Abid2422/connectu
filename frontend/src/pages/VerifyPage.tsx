import OtpVerify from '../components/auth/OtpVerify';

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Verify your email</h1>
        <div className="mt-6">
          <OtpVerify />
        </div>
      </div>
    </main>
  );
}
