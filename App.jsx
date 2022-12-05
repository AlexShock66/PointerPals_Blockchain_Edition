import React from 'react';

export const App = () => {
    return <BrowserRouter>
            <header className="container bg-dark w-80 p-3"><Link to='/' style={{ textDecoration: 'none' }}><h3 className="m-0 text-white">Store</h3></Link></header>
            <AppRoutes />
        </BrowserRouter>
}