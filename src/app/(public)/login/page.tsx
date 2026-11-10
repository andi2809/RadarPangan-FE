"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTarget = searchParams.get("from") || "/dashboard";

	const [email, setEmail] = useState("tpid.jabar@jabarprov.go.id");
	const [password, setPassword] = useState("••••••••");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !password) return;
		setIsSubmitting(true);

		const normalizedEmail = email.trim().toLowerCase();
		const role: "tpid" | "satgas" | "bapanas" = normalizedEmail.includes(
			"satgas",
		)
			? "satgas"
			: normalizedEmail.includes("bapanas")
				? "bapanas"
				: "tpid";

		setTimeout(() => {
			const mockUser = {
				id: "usr-cred-999",
				name:
					role === "satgas"
						? "Kompol Hendra Kusuma"
						: role === "bapanas"
							? "Ahmad Fauzi, M.Sc."
							: "Dr. Ir. Mohamad Arifin",
				nip: "19750814 199903 1 002",
				agency:
					role === "satgas"
						? "Polda Jabar"
						: role === "bapanas"
							? "Badan Pangan Nasional"
							: "TPID Jabar",
				role,
				provider: "jds" as const,
				email: email.trim(),
				token: `mock_cred_${Date.now()}`,
				issuedAt: Date.now(),
			};

			document.cookie = `tpid_session=${encodeURIComponent(
				JSON.stringify(mockUser),
			)}; path=/; max-age=86400; SameSite=Lax`;
			localStorage.setItem("tpid_sso_session", JSON.stringify(mockUser));
			router.push(redirectTarget);
		}, 500);
	};

	return (
		<div className="login-page py-12 px-4 sm:px-6 bg-[#f8f4e9] min-h-[80vh] flex items-center justify-center">
			<div className="max-w-md w-full bg-[#fffdf7] border border-[#ded8c8] rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
				{/* Brand Header */}
				<div className="text-center space-y-2">
					<Link
						href="/"
						className="inline-flex items-center gap-2.5 mb-1 group"
					>
						<div className="w-8 h-9 text-[#67151d] flex items-center justify-center flex-shrink-0">
							<svg
								viewBox="0 0 32 38"
								width="28"
								height="34"
								aria-hidden="true"
							>
								<path
									d="M16 2 20 8 16 13 12 8Z M7 11 12 16 9 22 4 17Z M25 11 28 17 23 22 20 16Z M12 18 16 13 20 18 19 26 16 30 13 26Z M4 23 11 26 13 32 7 30Z M28 23 21 26 19 32 25 30Z"
									fill="currentColor"
								/>
								<path
									d="M16 30v6"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<span className="font-black text-lg text-[#1e221f] tracking-tight">
							RADAR PANGAN
						</span>
					</Link>
					<h1 className="text-2xl font-black text-[#1e221f] tracking-tight">
						Masuk Portal Internal
					</h1>
					<p className="text-xs sm:text-sm text-[#5c5b52]">
						Masukkan email kedinasan dan kata sandi untuk mengakses Dashboard
						Early Warning System (EWS).
					</p>
				</div>

				{/* Manual Email & Password Form */}
				<form onSubmit={handleSubmit} className="space-y-4 text-sm">
					<div>
						<label
							htmlFor="loginEmail"
							className="block text-[#1e221f] mb-1.5 font-bold"
						>
							Email
						</label>
						<input
							id="loginEmail"
							type="email"
							required
							autoComplete="email"
							placeholder="nama@jabarprov.go.id"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm font-bold text-[#1e221f] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label
							htmlFor="loginPassword"
							className="block text-[#1e221f] mb-1.5 font-bold"
						>
							Kata Sandi
						</label>
						<input
							id="loginPassword"
							type="password"
							required
							autoComplete="current-password"
							placeholder="Masukkan kata sandi"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm font-mono font-bold text-[#1e221f] focus:outline-none transition-colors"
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3.5 px-5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
					>
						{isSubmitting
							? "Memverifikasi Kredensial..."
							: "Masuk ke Konsol EWS →"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="p-12 text-center text-xs font-mono text-[#5c5b52]">
					Memuat Halaman Masuk...
				</div>
			}
		>
			<LoginContent />
		</Suspense>
	);
}
