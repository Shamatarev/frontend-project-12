// @ts-nocheck

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import logoHexlet from './logo_hexlet.jpeg'; // Импорт изображения

const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};


const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        console.log('####', res.data)
        console.log('####%%', localStorage)
        auth.logIn();    
        
        const from = location.state && location.state.from ? location.state.from : '/';
         
        navigate(from);
        console.log('!!!!!!!!', from) 
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
<div className="d-flex flex-column h-100">
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container"><a className="navbar-brand" href="/">Hexlet Chat</a></div>
    </nav>
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src= {logoHexlet} className="rounded-circle" alt="Войти"/>
              </div>
                <Form 
                onSubmit={formik.handleSubmit} 
                className="col-12 col-md-6 mt-3 mt-mb-0"
                >
                  <h1 className="text-center mb-4">Войти</h1>
                  <fieldset disabled={formik.isSubmitting}>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={authFailed}
                        ref={inputRef}
                        required
                        className="form-control"
                        placeholder="Ваш ник"
                        name="username"
                        id="username"
                        autoComplete="username"
                      />
                      <Form.Label htmlFor="username">Ваш ник</Form.Label>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={authFailed}
                        required
                        className="form-control"
                        placeholder="password"
                        name="password"
                        id="password"
                        autoComplete="password"
                      />
                      <Form.Label htmlFor="password">Пароль</Form.Label>
                      <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                    </Form.Group>
                    <Button 
                    type="submit" 
                    variant="outline-primary"
                    className="w-100 mb-3 btn btn-outline-primary"
                    >
                      Войти
                    </Button>
                  </fieldset>
                </Form>
              </div>
              <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      </div>


  );

};

export default LoginPage;