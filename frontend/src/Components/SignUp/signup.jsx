import React, { useEffect, useRef, useState, useContext } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
//import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import avatar from '../../assets/avatar.jpg'; // Импорт изображения
import * as Yup from 'yup';
import Header from '../common/header';
import axios from 'axios';
import AuthContext from '../../contexts/index'; 

const validationSchema = Yup.object({
    username: Yup.string().required('Это поле обязательно')
    .min(4, 'Пароль должен быть не менее 4 символов')
    .max(20, 'Пароль должен быть не более 20 символов'),
    password: Yup.string()
      .required('Это поле обязательно')
      .min(4, 'Пароль должен быть не менее 4 символов')
      .max(20, 'Пароль должен быть не более 20 символов'),
      confirmPassword: Yup
      .string()
      .test(
        'passwordConfirmation', "Пароли должны совпадать",
        (password, context) => password === context.parent.password,
      ),
  });



const Signup = () => {

  const registerUser = async (userData) => {
    const response = await axios.post('/api/v1/signup', userData);
    return response.data; // Вернуть данные, полученные от сервера после регистрации
  };


  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  // const location = useLocation();
  // const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },

    validationSchema: validationSchema,
    validateOnBlur: false,
    
    
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        await validationSchema.validate(values, { abortEarly: false });
        const response = await registerUser(values); // Отправить данные на сервер
        
        localStorage.setItem('token', response.token);
        console.log('Регистрация прошла успешно:', response);

        logIn(values);
        // const from = location.state && location.state.from ? location.state.from : '/';
        // navigate(from);
        
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
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
          <Header/>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img src={avatar} className="rounded-circle" alt="Регистрация" />
                    </div>
                    <Form
                      onSubmit={formik.handleSubmit}
                      className="w-50"
                    >
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <fieldset disabled={formik.isSubmitting}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            isInvalid={authFailed || (formik.touched.username && formik.errors.username)}
                            ref={inputRef}
                            required
                            className="form-control"
                            placeholder="Имя пользователя"
                            name="username"
                            id="username"
                            autoComplete="username"
                          />
                          <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.password}
                            {authFailed && 'Такой пользователь уже существует'}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="form-floating mb-4">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            isInvalid={authFailed || (formik.touched.password && formik.errors.password)}
                            required
                            className="form-control"
                            placeholder="password"
                            name="password"
                            id="password"
                            autoComplete="confirm-password-field"
                          />
                          <Form.Label htmlFor="password">Подтвердите пароль</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.password}
                            {authFailed}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-floating mb-4">
                        <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            isInvalid={authFailed || (formik.touched.confirmPassword && formik.errors.confirmPassword)}
                            required
                            className="form-control"
                            placeholder="confirmPassword"
                            name="confirmPassword" // Переименовать в, например, "passwordConfirm"
                            id="confirmPassword" // Изменить на что-то уникальное
                            autoComplete="confirm-password-field"
                          />
                          <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.confirmPassword} {/* Используйте formik.errors.confirmPassword */}
                            {authFailed }
                          </Form.Control.Feedback>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };


export default Signup