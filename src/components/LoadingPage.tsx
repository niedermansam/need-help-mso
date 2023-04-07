import { useRouter } from "next/router";
import { LoadingAnimation } from ".";
import NavBar from "./Nav";
import { BackToSafetyButtons } from "../pages/404";
import { useState, useEffect } from "react";

export default function LoadingPage() {
    const router = useRouter()

    const [showBackSection, setShowBackSection] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowBackSection(true)
        }, 3000)


    }, [])

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center h-60">
          <h1 className="flex items-end text-rose-600 text-7xl font-extrabold mb-2">
            Loading
            <LoadingAnimation className="flex items-end h-4" />
          </h1>
          <h2 className="text-2xl text-stone-600 font-bold">{showBackSection ? "Sorry, we're still working on it...": "This might take a moment..."}</h2>
            {showBackSection && <h3 className="text-lg text-stone-600">You can go back or home if you want.</h3>}    
            {showBackSection && <BackToSafetyButtons router={router} className="flex justify-center mt-3" />}
        </div>
      </div>
    </div>
  );
}
