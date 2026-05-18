import { PawPrint } from "lucide-react";
import { login } from "@/app/login/actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-4 text-slate-950">
      <section className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-xl">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-teal-50 text-teal-700">
          <PawPrint className="size-7" aria-hidden="true" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Southwest Virginia Chihuahua</h1>
          <p className="mt-2 text-sm text-slate-500">Smart VOIP & Customer Care</p>
        </div>

        <form action={login} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Session password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-teal-400"
              required
            />
          </label>

          {params.error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              Incorrect password.
            </p>
          ) : null}

          <button
            type="submit"
            className="h-11 w-full rounded-md bg-teal-700 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}
