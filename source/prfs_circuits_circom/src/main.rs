mod builder;
mod paths;

pub type CircuitsError = Box<dyn std::error::Error + Sync + Send>;

fn main() {
    builder::run();
}
