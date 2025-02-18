/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

const Dashboard = () => {
    const { user } = useContext(UserDataContext);
 

    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                User Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

                <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-medium">{user.fullName.firstName} {user.fullName.lastName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-medium">{user.mobileNo}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
