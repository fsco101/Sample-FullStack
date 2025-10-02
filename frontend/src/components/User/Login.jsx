import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { authenticate, getUser } from '../../utils/helpers';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    let navigate = useNavigate()
    let location = useLocation()

    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password)
    }

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError('');
            
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(`http://localhost:4001/api/v1/login`, { email, password }, config)
            console.log(data)
            setLoading(false);
            authenticate(data, () => navigate("/"))

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: 'bottom-right'
            })
        }
    }

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
console.log(redirect)
    useEffect(() => {
        if (getUser()  ) {
             navigate('/')
        }
    }, [navigate])
    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg"
                                onSubmit={submitHandler}
                            >
                                <h1 className="mb-3">Login</h1>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading}
                                >
                                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                                </button>

                                <Link to="/register" className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>


                </>
            )}
        </>
    )
}
export default Login