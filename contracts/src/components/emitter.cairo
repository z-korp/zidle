// Dojo imports

use dojo::world::WorldStorage;

// Internal imports

// Interface

#[starknet::interface]
trait EmitterTrait<TContractState> {}

// Component

#[starknet::component]
mod EmitterComponent {
    // Dojo imports

    use dojo::world;
    use dojo::world::{WorldStorage, IWorldDispatcherTrait};

    // Internal imports

    // Local imports

    use super::EmitterTrait;

    // Storage

    #[storage]
    struct Storage {}

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[embeddable_as(EmitterImpl)]
    impl Emitter<
        TContractState, +HasComponent<TContractState>
    > of EmitterTrait<ComponentState<TContractState>> {}
}
