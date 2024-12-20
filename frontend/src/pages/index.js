import { useState } from 'react';
import axios from 'axios';

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

const Home = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        const userData = { name, email, password };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, userData);
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error creating user');
            }
        }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      const userData = { email, password };
  
      try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, userData);
          console.log('Login response:', response);
  
          if (response.data.message === 'Logged in successfully') {
              setMessage('Logged in successfully');
          } else {
              setMessage(response.data.message);
          }
      } catch (error) {
          console.log('Login error:', error);
          if (error.response && error.response.data) {
              setMessage(error.response.data.message);
          } else {
              setMessage('Error logging in');
          }
      }
  };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">{isLogin ? 'Login' : 'Register'}</h1>
                {message && (
                    <div className="mb-4 text-center text-red-500">{message}</div>
                )}
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
