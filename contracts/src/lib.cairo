mod constants;
mod store;

pub fn default_namespace() -> @ByteArray {
    @"zidle"
}

mod components {
    mod emitter;
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
    mod mocks {
        mod erc20;
        mod erc721;
        mod components {
            mod erc721_wallet;
        }
    }
}
