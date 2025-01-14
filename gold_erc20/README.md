# Gold ERC721 Contract

- `asdf global scarb 2.9.1`
- `scarb build`
- `starkli declare --watch target/dev/token_token.contract_class.json --compiler-version 2.9.1`
- `starkli deploy <class_hash> <owner_address>`