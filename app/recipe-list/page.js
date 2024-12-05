"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../_utils/auth-context';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const handleLoginClick = () => {
    router.push('/'); // Navigate to the login page
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing while waiting for client-side hydration
  }

  return (
    <div className="bg-cover bg-center h-screen flex flex-col" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <header className="bg-black bg-opacity-70 text-white p-4 flex justify-between items-center">
        {user ? (
          <div className="flex items-center">
            <p className="mr-4">Welcome, {user.email}</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white border-none px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="mr-4">Welcome, Guest</p>
            <button
              onClick={handleLoginClick}
              className="bg-red-500 text-white border-none px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white bg-opacity-80 p-8 rounded">
          <h1>Recipe Sharing Platform</h1>
          <RecipeForm />
          <RecipeList />
          <Footer/>
        </div>
      </div>
    </div>
  );
}
