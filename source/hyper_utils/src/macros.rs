#[macro_export]
macro_rules! generate_api_error_codes {
    (
        $struct: ident,
        $(
            $(#[$docs:meta])*
            ($code:expr, $konst:ident, $phrase:expr);
        )+
    ) => {
        pub struct $struct;

        impl $struct {
        $(
            $(#[$docs])*
            pub const $konst: ApiHandleErrorCode = ApiHandleErrorCode {
                code: $code,
                phrase: $phrase,
            };
        )+
        }
    }
}
