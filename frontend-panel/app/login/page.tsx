import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Acceso al panel
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ingresa la clave para consultar prospectos de VA Decoraciones.
        </p>

        <form action={login} className="mt-5 space-y-4">
          <input
            type="password"
            name="accessKey"
            placeholder="Clave de acceso"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
            required
          />

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}