export interface SignUpRequest {
  sig: String,
}

export interface SignUpResponse {
  status: String,
}

export async function signUpPrfsAccount(signUpReq: SignUpRequest) {
  try {
    let res = await fetch('http://localhost:4000/prfs_account::sign_up', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(signUpReq),
    });

    let resp: SignUpResponse = await res.json();

    if (!res.ok) {
      console.log('error fetching', res);
    }

    return resp;
  } catch (err) {
    console.log('error fetching', err);
  }
}

