'use client'; // This component must be client-side to use hooks

import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter(); // Initialize the router hook

  const handleSignUpRedirect = () => {
    router.push('/sign-up'); // Define the redirect logic
  };

  return (
    <button
      onClick={handleSignUpRedirect} // Attach the handler directly
      className="px-5 py-2 rounded-m font-medium `bg-[var(--button-bg)]` `text-[var(--button-text)]` shadow-md hover:opacity-90 transition-all duration-200"
    >
      Sign Up
    </button>
  );
}
