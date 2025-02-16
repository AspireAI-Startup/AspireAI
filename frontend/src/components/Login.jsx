import React from "react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        <form className="mt-4">

          {/*email*/}
          <div className="mb-4">
            <label className="text-1xl font-medium block text-gray-500 text-sm">Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/*password*/}
          <div className="mb-4">
            <label className="text-1xl font-medium block text-gray-500 text-sm">Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

            {/* Login Button */}
            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >Login
            </button>
      
        </form>

        {/* Register Link */}
        <p className="text-sm text-gray-600 text-center mt-4">
        Don't have an account?
          <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>


      </div>
    </div>
  );
};

export default Login;
