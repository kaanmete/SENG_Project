import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); 

    // Show the page if there is a ticket, otherwise redirect to Login.
    return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
