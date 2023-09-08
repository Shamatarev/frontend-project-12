/* eslint-disable max-len */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable import/order */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/index';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import logoHexlet from '../../assets/logo_hexlet.jpeg'; // Импорт изображения
import * as Yup from 'yup';
import Header from '../common/Header';
import { useTranslation } from 'react-i18next';

const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    password: Yup.string()
      .required(t('required')),
  });

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
        await validationSchema.validate(values, { abortEarly: false });
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn(values);
        const from = location.state && location.state.from ? location.state.from : '/';
        navigate(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
        }
        if (err.name === 'ValidationError') {
          const formErrors = err.inner.reduce((acc, current) => {
            acc[current.path] = current.message;
            return acc;
          }, {});
          formik.setErrors(formErrors);
        }
      }
    },
  });

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={logoHexlet} className="rounded-circle" alt={t('enter')} />
                </div>
                <Form
                  onSubmit={formik.handleSubmit}
                  className="col-12 col-md-6 mt-3 mt-mb-0"
                >
                  <h1 className="text-center mb-4">{t('enter')}</h1>
                  <fieldset disabled={formik.isSubmitting}>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={authFailed || (formik.touched.username && formik.errors.username)}
                        ref={inputRef}
                        required
                        className="form-control"
                        placeholder={t('yourNickname')}
                        name="username"
                        id="username"
                        autoComplete="username"
                      />
                      <Form.Label htmlFor="username">{t('yourNickname')}</Form.Label>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={authFailed || (formik.touched.password && formik.errors.password)}
                        required
                        className="form-control"
                        placeholder={t('password')}
                        name="password"
                        id="password"
                        autoComplete="password"
                      />
                      <Form.Label htmlFor="password">{t('password')}</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.password}
                        {authFailed && t('invalidData')}

                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-100 mb-3 btn btn-outline-primary"
                    >
                      {t('enter')}
                    </Button>
                  </fieldset>
                </Form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('noAccount')}</span>
                  {' '}
                  <a href="/signup">{t('signUp')}</a>
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
