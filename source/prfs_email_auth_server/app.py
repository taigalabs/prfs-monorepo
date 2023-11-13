import jwt;
import time;
import json;

with open('prfs-auth-key.json', 'r') as fd:
    data = json.load(fd);
    print(data["client_email"])

    iat = time.time()
    exp = iat + 3600

    payload = {'iss': data['client_email'],
               'sub': '123456-compute@developer.gserviceaccount.com',
               'aud': 'https://firestore.googleapis.com/',
               'iat': iat,
               'exp': exp};

    print(payload);

    # additional_headers = {'kid': PRIVATE_KEY_ID_FROM_JSON};
    # signed_jwt = jwt.encode(payload, PRIVATE_KEY_FROM_JSON, headers=additional_headers,
    #                        algorithm='RS256');

