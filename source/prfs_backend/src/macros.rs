// currently not used
#[macro_export]
macro_rules! routes {
    (
        $router: tt,
        $prefix: expr,
        [ $( ($method: tt, $path: expr, $handler: expr)$(,)? ),* ]
    ) => {{
        $(
            let $router = $router.$method(std::format!("{}/{}", $prefix, $path), $handler);
        )*
        $router
    }};
}
