mod constants;
mod store;

mod components {
    mod emitter;
    mod manageable;
}

mod models {
    mod index;
    mod player;
}

mod systems {
    mod account;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod account;
}
