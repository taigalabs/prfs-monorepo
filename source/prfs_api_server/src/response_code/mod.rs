use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ResponseCode(u32);

impl fmt::Debug for ResponseCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&self.0, f)
    }
}

macro_rules! generate_response_codes {
    (
        $(
            $(#[$docs:meta])*
            ($num:expr, $konst:ident, $phrase:expr);
        )+
    ) => {
        impl ResponseCode {
        $(
            $(#[$docs])*
            pub const $konst: ResponseCode = ResponseCode($num);
        )+

        }
    }
}

generate_response_codes! {
    (200, SUCCESS, "Success");
    (4000001, CANNOT_FIND_USER, "Can't find a user");
}
