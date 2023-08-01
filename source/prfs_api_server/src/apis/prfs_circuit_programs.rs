use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_program_type::CircuitProgram;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitProgramsRequest {
    page: u32,
    program_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitProgramsRespPayload {
    page: usize,
    prfs_circuit_programs: Vec<CircuitProgram>,
}

pub async fn get_prfs_native_circuit_programs(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitProgramsRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    let mut programs = vec![];
    if let Some(program_id) = req.program_id {
        match state.local_assets.programs.get(&program_id) {
            Some(pgm) => programs.push(pgm.clone()),
            None => {}
        };
    } else {
        for (_, pgm) in &state.local_assets.programs {
            programs.push(pgm.clone());
        }
    }

    let resp = ApiResponse::new_success(GetCircuitProgramsRespPayload {
        page: 0,
        prfs_circuit_programs: programs,
    });

    return Ok(resp.into_hyper_response());
}
