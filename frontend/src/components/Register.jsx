import React from "react";

const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
            
            <form className="mt-6">


              {/* First Name */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your first name"
                />
              </div>
    
              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your last name"
                />
              </div>
    
              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                />
              </div>
    
              {/* Password */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your password"
                />
              </div>
    
              {/* Mobile Number */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium">Mobile Number</label>
                <input
                  type="tel"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your mobile number"
                />
              </div>
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
              >Register
              </button>
            </form>
          </div>
        </div>
      );
    };
    
    export default Register;
    
  