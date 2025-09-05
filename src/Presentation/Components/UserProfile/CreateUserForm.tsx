import { useState } from "react";

import { EyeCloseIcon, EyeIcon } from "../../Assets/icons";
import { Button, Checkbox, Input, Label, PageBreadcrumb, Select } from "..";
import { useForm } from "../../Hooks";
import { regularExps } from "../../../config";


export const CreateUserForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    role: "",
    department: "",
    isActive: true,
  };

  const formValidations = {
    firstName: [(value: string) => regularExps.string.test(value), "Please enter a valid First Name"],
    lastName: [(value: string) => regularExps.string.test(value), "Please enter a valid Last Name"],
    email: [(value: string) => regularExps.email.test(value), "Please enter a valid email"],
    password: [(value: string) => regularExps.password.test(value), "Please enter a password with length more than 8 characters, with special characters and Uppercase"],
    confirmPassword: [(value: string) => value !== "", "Please confirm your password"],
    username: [(value: string) => regularExps.username.test(value), "Please enter a valid Username"],
    role: [(value: string) => value !== "", "Please select a role"],
    department: [(value: string) => value !== "", "Please select a department"],
  };

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    username,
    role,
    department,
    isActive,
    onInputChange,
    firstNameValid,
    lastNameValid,
    emailValid,
    passwordValid,
    confirmPasswordValid,
    usernameValid,
    roleValid,
    departmentValid,
  } = useForm(initialForm, formValidations);

  // Custom handler for Select components and checkbox
  const handleSelectChange = (field: string, value: string) => {
    // Create a synthetic event to match useForm's expected format
    const event = {
      target: {
        name: field,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleCheckboxChange = (checked: boolean) => {
    const event = {
      target: {
        name: "isActive",
        value: checked.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    
    // Additional validation for password match
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    
    // Create user object with form data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      username,
      role,
      department,
      isActive,
    };
    
    console.log("Form submitted:", userData);
    // Here you would typically call an API to create the user
  };

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
    { value: "contractor", label: "Contractor" },
  ];

  const departmentOptions = [
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
  ];


  return (
    <>
    <PageBreadcrumb pageTitle="Create User" />
    
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

      
      <form onSubmit={onSubmit}>
        <div className="space-y-7">
          {/* Personal Information */}
          <div>
            <h4 className="mb-5 text-base font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:gap-x-6">
              <div className="col-span-1">
                <Label>First Name<span className="ml-1 text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={onInputChange}
                  placeholder="Enter first name"
                  error={!!firstNameValid && formSubmitted}
                  hint={firstNameValid && formSubmitted ? firstNameValid : ""}
                />
              </div>
              
              <div className="col-span-1">
                <Label>Last Name<span className="ml-1 text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={onInputChange}
                  placeholder="Enter last name"
                  error={!!lastNameValid && formSubmitted}
                  hint={lastNameValid && formSubmitted ? lastNameValid : ""}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <Label>Email Address<span className="ml-1 text-error-500">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onInputChange}
                  placeholder="Enter email address"
                  error={!!emailValid && formSubmitted}
                  hint={emailValid && formSubmitted ? emailValid : ""}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <Label>Username<span className="ml-1 text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onInputChange}
                  placeholder="Enter the username for this user"
                  error={!!usernameValid && formSubmitted}
                  hint={usernameValid && formSubmitted ? usernameValid : ""}
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h4 className="mb-5 text-base font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Account Information
            </h4>
            
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:gap-x-6">
              <div className="col-span-1">
                <Label>Password<span className="ml-1 text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={onInputChange}
                    placeholder="Enter password"
                    error={!!passwordValid && formSubmitted}
                    hint={passwordValid && formSubmitted ? passwordValid : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-1">
                <Label>Confirm Password<span className="ml-1 text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onInputChange}
                    placeholder="Confirm password"
                    error={!!confirmPasswordValid && formSubmitted}
                    hint={confirmPasswordValid && formSubmitted ? confirmPasswordValid : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-1">
                <Label>Role<span className="ml-1 text-error-500">*</span></Label>
                <Select
                  options={roleOptions}
                  placeholder="Select user role"
                  onChange={(value) => handleSelectChange("role", value)}
                  defaultValue={role}
                />
                {roleValid && formSubmitted && (
                  <p className="mt-1.5 text-xs text-error-500">{roleValid}</p>
                )}
              </div>

              <div className="col-span-1">
                <Label>Department<span className="ml-1 text-error-500">*</span></Label>
                <Select
                  options={departmentOptions}
                  placeholder="Select department"
                  onChange={(value) => handleSelectChange("department", value)}
                  defaultValue={department}
                />
                {departmentValid && formSubmitted && (
                  <p className="mt-1.5 text-xs text-error-500">{departmentValid}</p>
                )}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isActive}
                    onChange={handleCheckboxChange}
                  />
                  <Label className="mb-0">
                    Account is active
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-center sm:gap-3 sm:mt-7 lg:justify-end">
          <Button 
            size="sm"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  </>

  );
}