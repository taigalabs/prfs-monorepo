use google_gmail1::api::Message;

pub enum VendorType {
    Twitter,
    Unknown,
}

pub fn get_vendor(msg: Message) -> VendorType {
    // println!("msg: {:?}", msg_response);
    let payload = if let Some(p) = msg.payload {
        p
    } else {
        return VendorType::Unknown;
    };

    let headers = if let Some(h) = payload.headers {
        h
    } else {
        println!("headers does not exist");
        // continue;
        return VendorType::Unknown;
    };

    for header in headers {
        println!("name: {:?}, value: {:?}", header.name, header.value);

        if let Some(name) = header.name {
            if name.contains("") {}
        }
    }

    return VendorType::Unknown;
}
