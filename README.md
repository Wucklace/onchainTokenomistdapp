# OnchainTokenomist — Dapp

> **On-Chain Economic Infrastructure — Tokenomics Is No Longer A Document.**

The OnchainTokenomist dapp is the front-end interface for the OnchainTokenomist protocol — a permissionless smart contract system for verifiable, on-chain token economies. It provides creators, admins, and pass holders with a role-aware interface for vault creation, pass distribution, vesting, and claiming — all interacting directly with the protocol via on-chain reads and writes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, TypeScript, React |
| Smart Contracts | Solidity ^0.8.20, Hardhat, OpenZeppelin |
| Web3 | Wagmi, Viem, RainbowKit, `@openzeppelin/merkle-tree` |
| Styling | Tailwind CSS |
| State | Zustand, Zod schema validation |
| Network | Nexus Testnet |

---

## Network

| Property | Value |
|---|---|
| Network | Nexus Testnet |
| Block Time | ~1 second |
| Default Mint Batch Size | 100 passes per transaction |

---

## Getting Started

### Prerequisites

- Node.js 22+
- A wallet supported by RainbowKit (MetaMask, Coinbase Wallet, WalletConnect, and all default RainbowKit wallets)
- Nexus Testnet configured in your wallet

### Installation

```bash
git clone https://github.com/wucklace/onchaintokenomistdapp
cd onchaintokenomistdapp
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```dotenv
# Nexus Testnet
NEXT_PUBLIC_NEXUS_TESTNET_CHAIN_ID=""
NEXT_PUBLIC_NEXUS_TESTNET_RPC_URL=""
NEXT_PUBLIC_NEXUS_TESTNET_EXPLORER_URL=""

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""

# Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=""
```
### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Dashboard — platform stats, role-aware notifications | Public |
| `/vaults` | All vaults on the protocol | Public |
| `/vaults/[id]` | Vault detail — summary, role-based actions | Public |
| `/vaults/[id]/analytic` | Vault analytics — allocations, vesting progress, claims | Public |
| `/my-vaults` | Creator's deployed vaults | Connected wallet |
| `/create-vault` | Vault creation wizard | Connected wallet |
| `/proposals` | Proposals — Creator and Admin tabs | Connected wallet |
| `/proposals/create` | Create a mint proposal (team-mode vaults) | Creator / Executor |
| `/proposals/mint` | Mint passes against an approved proposal | Creator / Executor |
| `/passes` | Pass holder's active passes and claim interface | Connected wallet |
| `/passes/mint` | Direct mint — creator-mode vaults only | Creator / Executor |

---

## Role-Based UI

The dapp resolves the connected wallet's role against each vault and renders actions accordingly. No action is presented unless the protocol permits it.

### Vault Detail Actions

Three actions are available on the vault detail page. Which render depends on the connected wallet's role, the vault's mode, and its current status:

- **Analytics** — always visible, connected or not
- **Mint Passes / Create Proposal** — rendered based on vault mode (creator vs team), vault status, and connected wallet role
- **Claim** — rendered for pass holders with vested, unclaimed tokens

### Proposals Page

The proposals page has two tabs:

- **Creator tab** — proposals the connected wallet has submitted
- **Admin tab** — proposals awaiting the connected wallet's approval or action

### Vault Finalization

Once all passes across all categories are fully distributed, the vault transitions to **finalized**. Mint actions are removed from the UI automatically — no further distribution is possible.

## Executor

The executor is an optional address configured at vault creation, designed for AI agent integration. It can submit proposals, trigger minting, and perform operational tasks autonomously within the bounds set at creation. No executor interface is provided in the dapp — it is intended for programmatic use only.

---

## Contract Interaction

The dapp reads and writes directly to the protocol via wagmi/viem hooks. There is no indexer, subgraph, or backend API — all state is resolved on-chain.

### Hooks

Each hook maps directly to a contract function:

| Hook | Contract Function |
|---|---|
| `useCreateVault` | `createVault` |
| `useClaim` | `claim` |
| `useMintDirect` | `mintDirect` |
| `useMintPasses` | `mintPasses` |
| `useAdminProposals` | `getAdminPendingProposals` |
| `useApproveProposal` | `approveMintProposal` |
| `useRejectProposal` | `rejectMintProposal` |
| `useCategoryTierDetails` | `getCategoryTierDetails` |
| `useMintProposal` | `proposeMintCategory` |
| `useInvolvedProposals` | `getInvolvedProposals` |
| `useProposalTiers` | `getProposalTiers` |
| `usePlatformStats` | `getPlatformStats` |
| `useTokensByOwner` | `getOwnerTokenIds` |
| `useUserPasses` | `getUserPasses` |
| `useVaultSummary` | `getVaultSummary` |
| `useVaultCategories` | `getVaultCategories` / `getCategoryTiers` |
| `useVaultCategoryAllocations` | `getVaultCategoryAllocations` |
| `useVaultSummaries` | `getVaultSummaries` |
| `useVaultSummariesByCreator` | `getVaultSummariesByCreator` |
| `useVestingConfig` | `getVestingSchedule` |
| `useNotifications` | Aggregated on-chain reads |
| `useWallet` | Wallet connection state |
| `useTokenApproval` | ERC-20 `approve` — called before vault creation for ERC-20 vaults only. Skipped entirely for native token vaults — no approval step exists for native deposits. |

`registrationFee` is read from `usePlatformStore` which is populated once on app mount by `PlatformProvider`.

---

## Vault Creation

Vault creation is handled through a multi-step wizard (`CreateVaultModal`) triggered from the `/Configure-Vault` page. The wizard walks the creator through four steps:

1. **Token & Start Date** — select the deposit token type and configure the date and time the vault parameters activate. The dapp converts the selected date and time to the corresponding block number. The full token amount is deposited atomically at creation.

   Two token types are supported:

   - **ERC-20** — enter the token contract address. The dapp fetches token metadata on-chain to confirm the address is valid. A separate approval transaction is required before vault creation to allow the contract to pull the deposit.
   - **Native Token** — one-click selection, no address or approval needed. The deposit is sent directly with the vault creation transaction. The `msg.value` sent to the contract covers both the registration fee and the full deposit:

   ```
   msg.value = registrationFee + depositAmount
   ```

2. **Categories & Tiers** — configure distribution groups (e.g. Team, Investors, Community) with custom tiers, per-pass allocations, and max supply caps.

3. **Vesting Schedule** — configure cliff, duration, and unlock intervals per category. Categories with vesting disabled release 100% of tokens at the start date.

4. **Governance & Execution** — choose Creator mode for direct control or Team mode for dual-admin approval. Optionally configure an AI agent executor for autonomous, agent-driven distribution. A full cost breakdown is shown before submission — registration fee, token deposit, and total `msg.value` for native vaults.

Once submitted, the transaction is atomic — the contract locks the full token amount and configuration permanently. Everything is immutable from this point.

---

## State Management

Global state is managed with Zustand. Key stores:

| Store | Purpose |
|---|---|
| `useTxStore` | Transaction lifecycle tracking — pending, confirming, confirmed, error |
| `useWizardStore` | Vault creation wizard — step state, form data, Zod validation |
| `useCreateModal` | Modal open/close state for the vault creation wizard |
| `usePlatformStore` | Platform-level contract constants — currently holds `registrationFee`. Populated once on app mount by `PlatformProvider`, refetched automatically if the `FeeUpdateExecuted` event fires on-chain. Read directly in any component via `usePlatformStore((s) => s.registrationFee)` — no `useReadContract` call needed. |

Form validation is handled with Zod schemas throughout the wizard flow.

### PlatformProvider

`PlatformProvider` is a side-effect component rendered inside the root provider tree. It fetches `registrationFee` from the contract once on mount and writes it to `usePlatformStore`. It also watches for the `FeeUpdateExecuted` contract event — if the governance process completes a fee update on-chain, the store is refreshed automatically without polling.
App mount → PlatformProvider fetches registrationFee → usePlatformStore
↑
FeeUpdateExecuted event fires → refetch → usePlatformStore updated

This means every component in the tree reads the same value from the same source with zero duplicate RPC calls.

---

## Notifications

The `useNotifications` hook aggregates on-chain reads to surface role-aware, actionable notifications on the dashboard. Notification types:

| Type | Triggered When |
|---|---|
| `proposal_pending` | A proposal awaits the connected wallet's admin approval |
| `proposal_rejected` | A proposal the connected wallet submitted was rejected |
| `proposal_expired` | A proposal the connected wallet submitted has expired |
| `proposal_needed` | A vault the connected wallet manages has no active proposal |
| `mint_ready` | A proposal is fully approved and ready to mint |
| `mint_direct` | A creator-mode vault has passes available to mint directly |
| `claimable` | A pass held by the connected wallet has vested tokens available |
| `pass_minted` | A new pass has been minted to the connected wallet |

---

## Wallet Support

All default RainbowKit wallets are supported — MetaMask, Coinbase Wallet, OKX Wallet, WalletConnect, and others. Network configuration follows standard RainbowKit chain setup for Nexus Testnet.