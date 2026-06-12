#!/usr/bin/env bash
set -euo pipefail

NETWORK="${SOROBAN_NETWORK:-testnet}"
SOURCE_ACCOUNT="${SOROBAN_SOURCE_ACCOUNT:-default}"
CONTRACT_NAME="${CONTRACT_NAME:-rwa-mint}"
WASM_PATH="${WASM_PATH:-target/wasm32-unknown-unknown/release/rwa_mint.wasm}"

cd "$(dirname "$0")/.."

cargo build --target wasm32-unknown-unknown --release -p "$CONTRACT_NAME"

stellar contract deploy \
  --wasm "$WASM_PATH" \
  --source "$SOURCE_ACCOUNT" \
  --network "$NETWORK"
