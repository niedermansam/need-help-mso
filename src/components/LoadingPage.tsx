import { useRouter } from "next/router";
import { LoadingAnimation } from ".";
import NavBar from "../app/_components/Nav";
import { BackToSafetyButtons } from "../pages/old_404";
import { useState, useEffect } from "react";

export default function LoadingPage() {
  const router = useRouter();

  const [showBackSection, setShowBackSection] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBackSection(true);
    }, 3000);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-60 text-center">
          <h1 className="mb-2 flex items-end text-7xl font-extrabold text-rose-600">
            Loading
            <LoadingAnimation className="flex h-4 items-end" />
          </h1>
          <h2 className="text-2xl font-bold text-stone-600">
            {showBackSection
              ? "Sorry, we're still working on it..."
              : "This might take a moment..."}
          </h2>
          {showBackSection && (
            <h3 className="text-lg text-stone-600">
              You can go back or home if you want.
            </h3>
          )}
          {showBackSection && (
            <BackToSafetyButtons
              router={router}
              className="mt-3 flex justify-center"
            />
          )}
        </div>
      </div>
    </div>
  );
}
