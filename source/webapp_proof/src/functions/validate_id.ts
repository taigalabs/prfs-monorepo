export interface IdForm {
  email: string;
  email_confirm: string;
  password_1: string;
  password_1_confirm: string;
  password_2: string;
  password_2_confirm: string;
}

// export interface IdFormErrors {
//   email: string;
//   email_confirm: string;
//   password_1: string;
//   password_1_confirm: string;
//   password_2: string;
//   password_2_confirm: string;
// }

function validateEmail(email: any) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

function checkPassword(str: string) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}

export function validateIdForm(
  formValues: IdForm,
  setFormErrors: React.Dispatch<React.SetStateAction<IdForm>>,
): boolean {
  if (!formValues.email || formValues.email.length < 1) {
    setFormErrors(oldVals => ({
      ...oldVals,
      email: "Email is not present",
    }));
    return false;
  }

  if (!formValues.email_confirm || formValues.email_confirm.length < 1) {
    setFormErrors(oldVals => ({
      ...oldVals,
      email_confirm: "Email confirm is not present",
    }));

    return false;
  }

  if (!validateEmail(formValues.email)) {
    setFormErrors(oldVals => ({
      ...oldVals,
      email: "Email is invalid",
    }));

    return false;
  }

  if (formValues.email !== formValues.email_confirm) {
    setFormErrors(oldVals => ({
      ...oldVals,
      email_confirm: "Emails are not identical",
    }));

    return false;
  }

  if (!formValues.password_1 || formValues.password_1.length < 15) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1: "Password should be 15 characters or longer",
    }));

    return false;
  }

  if (!checkPassword(formValues.password_1)) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1:
        "Password is invalid. It should include at least one special character, one lowercase letter, and one uppercase letter. It should be 15 characters or longer as well",
    }));

    return false;
  }

  if (formValues.password_1 !== formValues.password_1_confirm) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1_confirm: "Password 1s are not identical",
    }));

    return false;
  }

  return true;
}
