import jwt;
import time;
import json;

with open('prfs-auth-key.json', 'r') as fd:
    data = json.load(fd);
    print(data["client_email"])

    iat = time.time()
    exp = iat + 3600

    payload = {'iss': data['client_email'],
               'sub': data['client_email'],
               'aud': 'https://gmail.googleapis.com/',
               'iat': iat,
               'exp': exp};

    print(payload);

    additional_headers = {'kid': data['private_key']};
    signed_jwt = jwt.encode(payload, data['private_key'], headers=additional_headers,
                           algorithm='RS256');

    print(signed_jwt)

