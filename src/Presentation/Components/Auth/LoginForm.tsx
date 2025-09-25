import { Link } from "react-router";
import { Button, Checkbox, Input, Label } from "../Form";
import { useState } from "react";
import { useAuthStore, useForm } from "../../Hooks";
import { EyeCloseIcon, EyeIcon, GoogleIcon, XTwitterIcon } from "../../Assets/icons";
import { regularExps } from "../../../config";
import { LoadingSpinner } from "../UI";

export const LoginForm = () => {
  const initialForm = {
    email: "",
    password: ""   
  }
  const formValidations = {
    email: [ (value:string) => regularExps.email.test(value), 'Please enter a valid email'],
    password: [ (value:string) => value !== "", 'Please enter the password'],
  }

  const {email, password, onInputChange,  emailValid, passwordValid} = useForm(initialForm, formValidations)
  const {startLogin, errorMessage, status} = useAuthStore();

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCheck, setIsCheck] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setFormSubmitted(true);
    
    // Check if any form validation errors exist
    if (emailValid || passwordValid) {
      return; // Don't submit if there are validation errors
    }
    
    // Check if all required fields are filled
    if (!email.trim() || !password.trim()) {
      return; // Don't submit if required fields are empty
    }
    
    const user={email, password};
    startLogin(user);

  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">

      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <GoogleIcon />
                Sign in with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <XTwitterIcon className="fill-current" />
                Sign in with X
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

              <div className="space-y-6">
                {/* email */}
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    error={formSubmitted && !!emailValid}
                    hint={formSubmitted && !!emailValid && emailValid}

                  />
                </div>
                {/* password */}
                <div>
                  <Label>
                    Password <span className="text-error-500"> * </span> {" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={password}
                      onChange={onInputChange}
                      error={!!passwordValid && formSubmitted}
                      hint={!!passwordValid && formSubmitted ? passwordValid : ""}
                    />
                    <span
                      onClick={()=>setShowPassword(!showPassword)}
                      className={`absolute z-30 ${!!passwordValid && formSubmitted ? "-translate-y-5" : "-translate-y-1/2"} cursor-pointer right-4 top-1/2`}
                    >
                      {showPassword?(<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ):(
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isCheck} onChange={setIsCheck} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">Keep me logged in</span>
                  </div>
                  <Link to="/reset-password" className="text-sm text-brand-500 dark:text-brand-400">
                      Forgot password?
                  </Link>
                </div>
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
                Don&apos;t have an account? {""}
                <Link
                  to="/auth/register"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
