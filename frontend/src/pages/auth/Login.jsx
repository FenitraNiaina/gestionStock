import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import Logo from "../../assets/logo/images.png";
import "../../index.css";
import { login } from "../../data/AuthApi.js";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await login(email, password);

            localStorage.setItem(
                "gestionstock_auth",
                JSON.stringify({
                    isAuthenticated: true,
                    user,
                })
            );

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img src={Logo} alt="Logo" className="mx-auto h-14 w-14" />

                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        GestionStock
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Connectez-vous à votre espace d'administration
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Connexion
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Entrez vos identifiants pour continuer.
                    </p>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Adresse email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@gestionstock.com"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-focus)]"
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>

                            <div className="relative">
                                <Lock
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-focus)]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--couleur-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    <LogIn size={19} />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © 2026 GestionStock. Tous droits réservés.
                </p>
            </div>
        </div>
    );
}