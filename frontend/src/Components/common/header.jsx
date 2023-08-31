
import React from "react";
import { Button } from 'react-bootstrap';
import useAuth from '../../hooks/index.jsx';

const header = () => {

    const AuthButton = () => {

        const auth = useAuth();
      
        return (
          auth.loggedIn
            ? <Button onClick={auth.logOut} type="button" className="btn btn-primary">Выйти</Button>
            : null
        );
      };

    return (
       
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                    <a className="navbar-brand" href="/">Hexlet Chat</a>
                    <AuthButton />
                </div>
            </nav>
        
        );
        
}

export default header;