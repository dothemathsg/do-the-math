import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white border border-neutral-200 rounded-xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900 mb-6">
          Do The Math — Admin
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
