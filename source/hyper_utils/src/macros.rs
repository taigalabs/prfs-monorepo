#[macro_export]
macro_rules! generate_api_error {
    (
        $struct: ident,
        $(
            $(#[$docs:meta])*
            ($code:expr, $konst:ident, $msg:expr);
        )+
    ) => {
        pub struct $struct;

        impl $struct {
        $(
            $(#[$docs])*
            pub const $konst: ApiHandleError = ApiHandleError {
                code: $code,
                msg: $msg,
            };
        )+
        }
    }
}
