// Starknet imports
use starknet::info::{get_caller_address};
use starknet::ContractAddress;

// Dojo imports
use dojo::world::WorldStorage;

// Internal imports
use zidle::models::settings::Settings;

#[starknet::interface]
trait ISettings<T> {
    fn update_gold_erc20_address(ref self: T, address: ContractAddress);
    fn update_character_erc721_address(ref self: T, address: ContractAddress);
}

#[dojo::contract]
mod settings {
    // Internal imports
    use zidle::store::{Store, StoreTrait};
    use zidle::models::settings::SettingsTrait;
    use zidle::models::admin::{AdminTrait, AdminAssert};

    // Local imports
    use super::{ISettings, Settings, get_caller_address, ContractAddress, WorldStorage};

    // Constructor
    fn dojo_init(
        ref self: ContractState,
        admin_address: felt252,
        character_erc721_address: ContractAddress,
        gold_erc20_address: ContractAddress
    ) {
        // [Effect] Create the settings entity
        let mut world = self.world_default();
        let store: Store = StoreTrait::new(world);
        let mut settings: Settings = SettingsTrait::new();
        settings.set_character_erc721_address(character_erc721_address);
        settings.set_gold_erc20_address(gold_erc20_address);
        store.set_settings(settings);

        // [Effect] Create the admin entity
        let caller = get_caller_address();
        let admin = AdminTrait::new(caller.into());
        store.set_admin(admin);

        // [Effect] Set admin if provided
        let admin_address_felt: felt252 = admin_address.into();
        if admin_address_felt != 0 {
            let admin = AdminTrait::new(admin_address_felt);
            store.set_admin(admin);
        }
    }

    // Implementations
    #[abi(embed_v0)]
    impl SettingsImpl of ISettings<ContractState> {
        fn update_gold_erc20_address(ref self: ContractState, address: ContractAddress) {
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);

            // [Check] Only admin can update settings
            let caller = get_caller_address();
            let mut admin = store.admin(caller.into());
            admin.assert_is_admin();

            // [Effect] Update zkorp address
            let mut settings = store.settings();
            settings.set_gold_erc20_address(address);
            store.set_settings(settings);
        }

        fn update_character_erc721_address(ref self: ContractState, address: ContractAddress) {
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);

            // [Check] Only admin can update settings
            let caller = get_caller_address();
            let mut admin = store.admin(caller.into());
            admin.assert_is_admin();

            // [Effect] Update zkorp address
            let mut settings = store.settings();
            settings.set_character_erc721_address(address);
            store.set_settings(settings);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// This function is handy since the ByteArray can't be const.
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(crate::default_namespace())
        }
    }
}
