import { ID } from "@taigalabs/prfs-id-sdk-web";

const MINIMUM_ID_LEN = 7;
const MINIMUM_PW_LEN = 20;

export const makeEmptyIdCreateForm: () => IdCreateForm = () => ({
  // id: "",
  // id_confirm: "",
  password: "",
  password_confirm: "",
  password_prefix: "",
  // password_2: "",
  // password_2_confirm: "",
  // password_2_prefix: "",
});

export const makeEmptyIDCreateFormErrors: () => IdCreateForm = () => ({
  // id: "",
  // id_confirm: "",
  password: "",
  password_confirm: "",
  password_prefix: "",
  // password_2: "",
  // password_2_confirm: "",
  // password_2_prefix: "",
});

export interface IdCreateForm {
  // id: string | null;
  // id_confirm: string | null;
  password: string | null;
  password_confirm: string | null;
  // password_2: string | null;
  // password_2_confirm: string | null;
  password_prefix: string | null;
}

function checkPassword(str: string | null): [boolean, string] {
  if (!str) {
    return [false, "not exist"];
  }

  if (str?.length < MINIMUM_PW_LEN) {
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

export function validateId(
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

  if (formValues[ID]?.length < MINIMUM_ID_LEN) {
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

  return true;
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

  if (formValues[ID]?.length < MINIMUM_ID_LEN) {
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

  if (!checkPassword(formValues.password)) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1:
        "Password is invalid. It should include at least one special character, one lowercase and one uppercase letters. It should be 15 characters or longer as well",
    }));

    return false;
  }

  if (formValues.password !== formValues.password_confirm) {
    setFormErrors(oldVals => ({
      ...oldVals,
      password_1_confirm: "Password 1s are not identical",
    }));

    return false;
  }

  // if (!checkPassword(formValues.password_2)) {
  //   setFormErrors(oldVals => ({
  //     ...oldVals,
  //     password_2:
  //       "Password is invalid. It should include at least one special character, one lowercase and one uppercase letters. It should be 15 characters or longer as well",
  //   }));

  //   return false;
  // }

  // if (formValues.password_2 !== formValues.password_2_confirm) {
  //   setFormErrors(oldVals => ({
  //     ...oldVals,
  //     password_2_confirm: "Password 2s are not identical",
  //   }));

  //   return false;
  // }

  // if (formValues.password_1 === formValues.password_2) {
  //   setFormErrors(oldVals => ({
  //     ...oldVals,
  //     password_2: "Password 1 and 2 should be different",
  //   }));

  //   return false;
  // }

  return true;
}
