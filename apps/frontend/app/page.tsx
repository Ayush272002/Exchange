"use client";

import PrimaryButton from "@repo/ui/primaryButton";
import SuccessButton from "@repo/ui/sucessButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: "0.9",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 grid grid-cols-3 h-full">
        <div className="col-span-2 m-16 flex flex-col justify-center">
          <div
            className="text-white font-extrabold"
            style={{ fontSize: "5rem" }}
          >
            Look Deep.
          </div>
          <div
            className="text-white font-extrabold"
            style={{ fontSize: "5rem" }}
          >
            Act Bold.
          </div>
          <div
            className="text-white font-bold mt-4"
            style={{ fontSize: "1.5rem" }}
          >
            <p>
              Success comes to those who <br />
              prepare and seize the moment.
            </p>
          </div>

          <div className="flex mt-10 space-x-4">
            <SuccessButton onClick={() => router.push("/markets")}>
              All Markets
            </SuccessButton>
            <PrimaryButton
              onClick={() => {
                router.push("/trade/SOL_USDC");
              }}
            >
              Solana
            </PrimaryButton>
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-end items-end p-16">
          <div className="text-gray-400" style={{ fontSize: "1rem" }}>
            CEO: Ayush Acharjya
          </div>
        </div>
      </div>
    </div>
  );
}
