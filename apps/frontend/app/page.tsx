import Image from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <h1 className="text-white text-4xl font-bold">
        Tailwind CSS is working!
      </h1>
      <button className="mt-4 bg-green-500 text-white p-2 rounded-lg">
        Tailwind Button
      </button>
    </div>
  );
}
