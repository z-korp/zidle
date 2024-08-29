mod constants;
mod store;

mod components {
    mod emitter;
    mod manageable;
    mod erc721 {
        mod erc721_wallet;
    }
}

mod helpers {
    mod level;
    mod account_deployer;
}

mod interfaces {
    mod ierc20;
    mod ierc721;
    mod systems;
}

mod models {
    mod char;
    mod miner;
    mod player;
    mod token_config;
}

mod resources {
    mod interface;
    mod wood;
    mod food;
    mod mineral;
}

mod systems {
    mod account;
    mod character_minter;
    mod character_token;
    mod character;
    mod gold_minter;
    mod gold_token;
    mod resources;
}

mod types {
    mod resource;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod account;
    mod resources;
    mod character_token;
    mod gold_token;
}
