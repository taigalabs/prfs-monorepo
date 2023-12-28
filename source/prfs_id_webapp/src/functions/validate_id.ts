export const makeEmptyIdCreateForm: () => IdCreateForm = () => ({
  email: "",
  email_confirm: "",
  password_1: "",
  password_1_confirm: "",
  password_2: "",
  password_2_confirm: "",
});

export const makeEmptyIDCreateFormErrors: () => IdCreateForm = () => ({
  email: "",
  email_confirm: "",
  password_1: "",
  password_1_confirm: "",
  password_2: "",
  password_2_confirm: "",
});

export interface IdCreateForm {
  email: string;
  email_confirm: string;
  password_1: string;
  password_1_confirm: string;
  password_2: string;
  password_2_confirm: string;
}

function validateEmail(email: any) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

function checkPassword(str: string): [boolean, string] {
  if (str.length < 15) {
    return [false, "too short"];
  } else if (str.search(/\d/) === -1) {
    return [false, "no digit"];
  } else if (str.search(/[a-z]/) === -1) {
    return [false, "no_lower_letter"];
  } else if (str.search(/[A-Z]/)) {
    return [false, "no_upper_letter"];
  } else if (str.search(/[^-!@._*#%]/)) {
    return [false, "no symbol"];
  } else {
    return [true, ""];
  }

  // var re =
  //   /^(?=\D\d)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^-!@._*#%]*[-!@._*#%])[-A-Za-z0-9=!@._*#%]*$/;
  // return re.test(str || "");
}

export function validateIdCreateForm(
  formValues: IdCreateForm,
  setFormErrors: React.Dispatch<React.SetStateAction<IdCreateForm>>,
): boolean {
  setFormErrors(() => makeEmptyIDCreateFormErrors());
  // console.log(22, formValues);

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

  if (!checkPassword(formValues.password_1)) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1:
        "Password is invalid. It should include at least one special character, one lowercase and one uppercase letters. It should be 15 characters or longer as well",
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

  if (!checkPassword(formValues.password_2)) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_2:
        "Password is invalid. It should include at least one special character, one lowercase and one uppercase letters. It should be 15 characters or longer as well",
    }));

    return false;
  }

  if (formValues.password_2 !== formValues.password_2_confirm) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_2_confirm: "Password 2s are not identical",
    }));

    return false;
  }

  if (formValues.password_1 === formValues.password_2) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_2: "Password 1 and 2 should be different",
    }));

    return false;
  }

  return true;
}
