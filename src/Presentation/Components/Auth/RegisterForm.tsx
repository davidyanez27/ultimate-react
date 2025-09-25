import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon, GoogleIcon, XTwitterIcon } from "../../Assets/icons";
import { Button, Checkbox, Input, Label } from "../Form";
import { useState } from "react";
import { useAuthStore, useForm } from "../../Hooks";
import { regularExps } from "../../../config";
import { LoadingSpinner } from "../UI";

export const RegisterForm = () => {

  const initialFrom = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  }

  const formValidations = {
    username: [(value: string) => regularExps.username.test(value), "Please enter a valid Username"],
    firstName: [(value: string) => regularExps.string.test(value), "Please enter a valid Name"],
    lastName: [(value: string) => regularExps.string.test(value), "Please enter a valid Last Name"],
    email: [(value: string) => regularExps.email.test(value), 'Please enter a valid email'],
    password: [(value: string) => regularExps.password.test(value), 'Please enter a password with lenght more than 8 characteres, with special characters and Uppercase'],
  }

  const {
    username,
    firstName,
    lastName,
    email,
    password,
    onInputChange,
    usernameValid,
    firstNameValid,
    lastNameValid,
    emailValid,
    passwordValid
  } = useForm(initialFrom, formValidations)

  const {startRegister, errorMessage, status} = useAuthStore();

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCheck, setIsCheck] = useState(false)
  const [checkboxError, setCheckboxError] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    setFormSubmitted(true);
    
    // Check if terms are agreed to
    if (!isCheck) {
      setCheckboxError(true);
      return; // Don't submit if terms not agreed
    }
    
    setCheckboxError(false);
    
    // Check if any form validation errors exist
    if (usernameValid || firstNameValid || lastNameValid || emailValid || passwordValid) {
      return; // Don't submit if there are validation errors
    }
    
    // Check if all required fields are filled
    if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      return; // Don't submit if required fields are empty
    }
    
    const user={
      username,
      firstName,
      lastName,
      email,
      password,
    }
    startRegister(user)
    
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <GoogleIcon />
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <XTwitterIcon className="fill-current" />
                Sign up with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Username<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={onInputChange}
                      error={!!usernameValid && formSubmitted ? true: false}
                      hint={!!usernameValid && formSubmitted ? usernameValid: ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={onInputChange}
                      error={!!firstNameValid && formSubmitted ? true: false}
                      hint={!!firstNameValid && formSubmitted ? firstNameValid: ""}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={onInputChange}
                      error={!!lastNameValid && formSubmitted}
                      hint={lastNameValid && formSubmitted ? lastNameValid : ""}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={onInputChange}
                    error={!!emailValid && formSubmitted}
                    hint={!!emailValid && formSubmitted ? emailValid : ""}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={onInputChange}
                      error={!!passwordValid && formSubmitted}
                      hint={!!passwordValid && formSubmitted ? passwordValid : ""}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute z-30 ${ !!passwordValid && formSubmitted ? "-translate-y-7": "-translate-y-1/2"} cursor-pointer right-4 top-1/2`}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      className="w-5 h-5"
                      checked={isCheck}
                      onChange={(checked) => {
                        setIsCheck(checked);
                        if (checked) setCheckboxError(false);
                      }}
                    />
                    <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                      By creating an account means you agree to the{" "}
                      <span className="text-gray-800 dark:text-white/90">
                        Terms and Conditions,
                      </span>{" "}
                      and our{" "}
                      <span className="text-gray-800 dark:text-white">
                        Privacy Policy
                      </span>
                    </p>
                  </div>
                  {checkboxError && (
                    <p className="mt-1.5 text-xs text-error-500">
                      You must agree to the Terms and Conditions and Privacy Policy to continue
                    </p>
                  )}
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={status === 'checking'}
                    startIcon={status === 'checking' ? <LoadingSpinner size="sm" className="text-white" /> : undefined}
                  >
                    {status === 'checking' ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </div>
            </form>

            {errorMessage && 
              <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mt-5 text-center" role="alert" >
                  <span className="block sm:inline">{errorMessage}</span>
              </div>
            }

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/auth/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}