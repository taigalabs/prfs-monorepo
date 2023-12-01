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

export async function validateIdForm(
  formValues: IdForm,
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>,
) {}
