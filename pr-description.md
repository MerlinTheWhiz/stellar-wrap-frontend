# PR Description: Connect Address Paste Input to Indexer Service with Real-Time Validation
## Description
Fixes #36

This PR adds real-time Stellar address validation to the Connect page. When users manually paste a Stellar wallet address, we now evaluate the format in real-time, ping the Horizon SDK to confirm account existence, and simulate pushing the valid account to an indexing service.

### Changes Included
- Added `validateStellarAddress` utility built on top of `stellar-sdk` StrKey functionality.
- Created `useStellarAddressValidation` hook which handles address state, debouncing (300ms), error handling, and formatting (spaces truncation and uppercase mapping).
- Included a mock `indexerService` to unblock feature completion until the real service (`#34`) is merged. 
- Integrated the validation UI logic directly into `app/connect/page.tsx`, displaying live animations to indicate `"Checking account..."`, `"Indexing transactions..."`, or relevant error messages.
- The `Start Wrapping` button disables automatically while validation/indexing takes place or upon an invalid state.
- Supported cases: Invalid format, non-existent networks, successful indexing flow.

