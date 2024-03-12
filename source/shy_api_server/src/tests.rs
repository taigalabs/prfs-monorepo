use shy_entities::proof_action::{CreateShyTopicAction, ShyTopicProofAction};

#[test]
fn test_proof_action_serialize() {
    let str = r#"{"power": "su pe r"}"#;
    println!("str: {}", str);

    let str_b = str.as_bytes();
    println!("str_b: {:?}", str_b);

    let str_str = serde_json::to_string(str).unwrap();
    println!("str_str: {:?}", str_str);

    let str_b2 = serde_json::to_vec(str).unwrap();
    println!("str_b2: {:?}", str_b2);

    let action = ShyTopicProofAction::create_shy_topic(CreateShyTopicAction {
        topic_id: "power 11".to_string(),
        channel_id: " pork 1".to_string(),
        content: " af foo ".to_string(),
    });

    let action_str = serde_json::to_string(&action).unwrap();
    println!("action_str: {:?}", action_str);

    let action_b = serde_json::to_vec(&action).unwrap();
    println!("action_b1: {:?}", action_b);

    let action_b2 = action_str.as_bytes();
    println!("action_b2: {:?}", action_b2);
}
