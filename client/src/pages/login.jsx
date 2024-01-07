import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";

const userNameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const Login = () => {
  const {auth,  setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const userNameRef = useRef();
  const [userName, setUserName] = useState("");
  const [isValidUserName, setIsValidUserName] = useState(false);
  const [onFocusUserName, setOnFocusUserName] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [onFocusPassword, setOnFocusPassword] = useState(false);
  const [isTextPass, setIsTextPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userNameRef?.current?.focus();
  });
  useEffect(() => {
    setIsValidUserName(userNameRegex.test(userName));
  }, [userName]);

  useEffect(() => {
    setIsValidPassword(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    setErrorMsg("");
  }, [userName, password]);

  const handleSubmi = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/user/login",
        { userName, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.AccessToken;
      const role = response?.data?.role;
      setAuth({userName, role, accessToken});
      console.log(auth);
      setUserName("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("ارتباط با سرور برقرار نشد.");
      } else if (error?.response?.status === 404) {
        setErrorMsg("کاربری با این مشخصات پیدا نشد.");
      } else if (error?.response?.status === 401) {
        setErrorMsg("رمز عبور اشتباه است!");
      } else {
        setErrorMsg("خطایی در هنگام ورود رخ داد.");
      }
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-blue-400 relative">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 shadow-lg shadow-blue-400
            flex flex-col justify-start items-center p-4 rounded-lg md:w-[50%] lg:w-[40%] xl:w-[30%] 
            sm:w-[60%] w-[85%] space-y-2"
        >
          <p className=" text-3xl font-bold text-cyan-500 border-b-[1px] border-gray-400 pb-2 mb-2 px-3 drop-shadow-md">
            ورود به سایت
          </p>
          <div className=" pb-4">
            <img
              src="/assets/images/login-svgrepo-com.svg"
              className="w-48 h-28
             drop-shadow-xl shadow-blue-900"
              alt=""
            />
          </div>
          <form className=" space-y-5 w-full" onSubmit={handleSubmi}>
            <div className=" flex flex-col space-y-2 relative">
              <input
                // ref={userNameRef}
                required
                autoComplete="off"
                value={userName}
                onChange={(e) => setUserName(e.target?.value)}
                onFocus={() => setOnFocusUserName(true)}
                onBlur={() => setOnFocusUserName(false)}
                placeholder="نام کاربری"
                type="text"
                className="border-none focus:ring-0 bg-blue-100 focus:bg-gray-200 ring-1 rounded-xl
                  focus:shadow-lg pr-8"
              />
              <p
                className={`errorMsg ${
                  !isValidUserName && onFocusUserName && userName
                    ? "visible"
                    : "hidden"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                نام کاربری باید حداقل سه کاراکتر داشته و انگلیسی باشد.
              </p>
            </div>
            <div className=" flex flex-col space-y-2 relative">
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setOnFocusPassword(true)}
                onBlur={() => setOnFocusPassword(false)}
                placeholder="رمز عبور"
                type={isTextPass ? "text" : "password"}
                className="pr-8 border-none focus:ring-0 bg-blue-100 focus:bg-gray-200 ring-1 rounded-xl focus:shadow-lg leading-4"
              />
              <div
                onClick={() => setIsTextPass((prev) => !prev)}
                className="absolute right-1 cursor-pointer"
              >
                {isTextPass ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`errorMsg ${
                  !isValidPassword && onFocusPassword && password
                    ? "visible"
                    : "hidden"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                رمز عبور باید حداقل ۶ کاراکتر و دارای یکی از نشانه های
                ٬٫ریال٪×،*! باشد.
              </p>
            </div>

            {errorMsg && (
              <div className="errorMsg bg-red-200 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 absolute mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="w-full text-center">{errorMsg}</p>
              </div>
            )}
            <div className=" text-center">
              <button
                disabled={!isValidUserName || !isValidPassword ? true : false}
                className=" py-2 w-full hover:bg-blue-700 bg-cyan-600 rounded-lg shadow-sm shadow-cyan-600 text-gray-100
                hover:shadow-lg hover:shadow-blue-700 mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed
                 disabled:hover:shadow-none"
              >
                {isLoading ? <BeatLoader color="#FFF" size={7} /> : "ورود"}
              </button>
            </div>
            <div className=" text-center hover:text-blue-500 hover:underline">
              <Link to="/register">حساب کاربری ندارم.</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
