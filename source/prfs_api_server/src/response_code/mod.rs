use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub fn a() {
    let mut b = native_json::json! {
        name: "native json",
        style: {
            color: "red",
            size: 12,
            bold: true,
            range: null
        },
        array: [5,4,3,2,1],
        vector: vec![1,2,3,4,5],
        hashmap: HashMap::from([ ("a", 1), ("b", 2), ("c", 3) ]),
        students: [
            {name: "John", age: 18},
            {name: "Jack", age: 21},
        ],
    };
    println!("json: {:?}", b);
}
