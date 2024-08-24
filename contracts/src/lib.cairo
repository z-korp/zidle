mod constants;
mod store;

mod resources {
    mod interface;
    mod wood;
    mod food;
    mod mineral;
}

mod types {
    mod resource;
}

mod components {
    mod emitter;
    mod manageable;
}

mod models {
    mod index;
    mod player;
    mod miner;
}

mod helpers {
    mod level;
}

mod systems {
    mod account;
    mod resources;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod account;
    mod resources;
}
