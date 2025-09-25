import { useEffect, useMemo, useState, type ChangeEvent, } from 'react';

export const useForm = (initialForm: {[Key:string]:any}, formValidations: {[key:string]:any}={}):any => {

  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState<{[key:string]:any}>({});

  useEffect(() => {
    createValidators()
  }, [formState])
  
const isFormValid = useMemo(() => {
    for (const FormValue of Object.keys( formValidation)) {
    if (formValidation[FormValue] !== null) return false;
  }
  return true;
}, 

[formValidation])


  const onInputChange = ({target}: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

const createValidators = () => {
  const formCheckedValues:{[key:string]:any} = {};

  for (const formField of Object.keys(formValidations)) {
    const [fn, errorMessage] = formValidations[formField];
    formCheckedValues[`${formField}Valid`] =
      fn(formState[formField]) ? null : errorMessage;
  }

  setFormValidation(formCheckedValues);
};


  return {
    formState,
    onInputChange,
    onResetForm,
    ...formState,
    ...formValidation,
    isFormValid
  };
};
