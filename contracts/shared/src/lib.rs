#![no_std]

use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AssetStatus {
    Draft,
    Active,
    Funded,
    Repaid,
    Defaulted,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BusinessAccount {
    pub owner: Address,
    pub company_name: String,
    pub registration_number: String,
    pub country: String,
    pub verification_status: VerificationStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AssetSnapshot {
    pub token_id: u64,
    pub owner: Address,
    pub invoice_id: String,
    pub value: i128,
    pub due_date: u64,
    pub status: AssetStatus,
}
