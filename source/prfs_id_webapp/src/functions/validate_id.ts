import { ID } from "@taigalabs/prfs-id-sdk-web";

const MINIMUM_ID_LENGTH = 9;

export const makeEmptyIdCreateForm: () => IdCreateForm = () => ({
  id: "",
  id_confirm: "",
  password_1: "",
  password_1_confirm: "",
  password_2: "",
  password_2_confirm: "",
});

export const makeEmptyIDCreateFormErrors: () => IdCreateForm = () => ({
  id: "",
  id_confirm: "",
  password_1: "",
  password_1_confirm: "",
  password_2: "",
  password_2_confirm: "",
});

export interface IdCreateForm {
  id: string | null;
  id_confirm: string | null;
  password_1: string | null;
  password_1_confirm: string | null;
  password_2: string | null;
  password_2_confirm: string | null;
}

// function validateEmail(email: any) {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );
// }

function checkPassword(str: string | null): [boolean, string] {
  if (!str) {
    return [false, "not exist"];
  }

  if (str?.length < 15) {
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
}

export function validateIdCreateForm(
  formValues: IdCreateForm,
  setFormErrors: React.Dispatch<React.SetStateAction<IdCreateForm>>,
): boolean {
  setFormErrors(() => makeEmptyIDCreateFormErrors());
  if (!formValues.id || formValues.id.length < 1) {
    setFormErrors(oldVals => ({
      ...oldVals,
      id: "Id is not present",
    }));
    return false;
  }

  if (!formValues.id_confirm || formValues.id_confirm.length < 1) {
    setFormErrors(oldVals => ({
      ...oldVals,
      id_confirm: "Id confirm is not present",
    }));

    return false;
  }

  if (formValues[ID]?.length < MINIMUM_ID_LENGTH) {
    setFormErrors(oldVals => ({
      ...oldVals,
      id: "Id should be 9 letter or longer",
    }));

    return false;
  }

  if (formValues.id !== formValues.id_confirm) {
    setFormErrors(oldVals => ({
      ...oldVals,
      id_confirm: "Ids are not identical",
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
