"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './_utils/auth-context';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, login, register, loginWithGoogle, loginWithGithub, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push('./recipe-list'); // Redirect to the home page
    } catch (error) {
      console.error('Failed to log in or register', error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (user != null) {
      router.push('./recipe-list'); // Redirect to the home page
    }
  }, [user, router]);

  return (
    <div
      style={{
        backgroundImage: 'url(background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '2rem', borderRadius: '8px', width: '50vw' }}>
        <h1 className="content-center text-center bg-black text-white font-extrabold text-2xl">{isRegistering ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <p>
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <a 
                onClick={() => setIsRegistering(false)}
                className="underline">Login</a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a 
                  onClick={() => setIsRegistering(true)} 
                  className="underline">Register</a>
              </>
            )}
          </p>
        </div>
        {!user && (
          <div>
            <div>
              <button onClick={loginWithGoogle}>Login with Google</button>
            </div>
            <div>
              <button onClick={loginWithGithub}>Login with GitHub</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}