mod constants;
mod store;

pub fn default_namespace() -> @ByteArray {
    @"zidle"
}

mod components {
    mod emitter;
    mod manageable;
}

mod helpers {
    mod level;
    mod account_deployer;
}

mod interfaces {
    mod ierc20;
    mod ierc721;
    mod systems;
    mod account;
}

mod models {
    mod char;
    mod miner;
    mod player;
    mod token_config;
    mod settings;
    mod admin;
}

mod events {
    mod index;
}

mod resources {
    mod interface;
    mod wood;
    mod food;
    mod mineral;
}

mod systems {
    mod character_minter;
    mod character;
    mod gold_minter;
    mod resources;
    mod settings;
}

mod types {
    mod resource;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod resources;
    mod character_token;
    mod gold_token;
}
