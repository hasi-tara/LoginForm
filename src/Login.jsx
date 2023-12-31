import { useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
const LOGIN_URL = '/auth';

function Login() {
    const { setAuth } = useContext(AuthContext);
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const role = response?.data?.role;
            setAuth({ user, pwd, role, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            switch (err?.response?.status) {
                case undefined:
                    setErrMsg('پاسخی از سرور دریافت نشد');
                    break;
                case 400:
                    setErrMsg('رمز یا نام کاربری اشتباه است');
                    break;
                case 401:
                    setErrMsg('شما اجازه ورود ندارید');
                    break;
                default:
                    setErrMsg('ورود ناموفق است');
                    break;
            }
        }
    }

    return (
        <>
            {success ? (
                <div>
                    <h1>با موفقیت وارد شدید</h1>
                    <a href="#">رفتن به صفحه اصلی</a>
                </div>
            ) : (
                <div>
                    <p >{errMsg}</p>
                    <h1>ورود</h1>
                    <form onSubmit={handleSubmit}>
                        <label href="username">نام کاربری:</label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                        />

                        <label href="password">رمز:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                        />
                        <button>ورود</button>
                    </form>
                    <a href="#">ثبت نام</a>
                    
                </div>
            )}
        </>
    )
}

export default Login
