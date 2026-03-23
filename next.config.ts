import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite HMR y recursos de dev cuando entrás por túnel (p. ej. ngrok).
  allowedDevOrigins: ["919e-190-171-228-246.ngrok-free.app"],
  transpilePackages: [
    "@solana/wallet-adapter-base",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-wallets",
  ],
};

export default nextConfig;
