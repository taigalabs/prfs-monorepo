use crate::AssetServerError;

pub struct AssetBuildJson {}

impl AssetBuildJson {
    pub fn new() -> Result<AssetBuildJson, AssetServerError> {
        let a = AssetBuildJson {};

        Ok(a)
    }
}
