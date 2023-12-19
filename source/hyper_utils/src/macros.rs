#[macro_export]
macro_rules! generate_api_error_codes {
    (
        $struct: ident,
        $object_literal: ident,
        $(
            $(#[$docs:meta])*
            ($code:expr, $name:ident, $phrase:expr);
        )+
    ) => {
        #[allow(non_snake_case)]
        #[derive(Serialize, Deserialize)]
        pub struct $struct {
        $(
            pub $name: ApiHandleErrorCode,
        )+
        }

        lazy_static::lazy_static! {
            pub static ref $object_literal: $struct = {
                // let error_codes_str = include_str!("../../data_api/error_codes.json");

                let ret: $struct = $struct {
                    $(
                        $name: ApiHandleErrorCode {
                            code: $code,
                            phrase: String::from($phrase),
                        },
                    )+
                };

                ret
            };
        }

        // impl $struct {
        // $(
        //     $(#[$docs])*
        //     pub const $name: ApiHandleErrorCode = ApiHandleErrorCode {
        //         code: $code,
        //         phrase: String::from($phrase),
        //     };
        // )+
        // }
    }
}
