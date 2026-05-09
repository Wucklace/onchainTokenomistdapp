import { getAddress } from 'viem';

export const CONTRACT_ADDRESS = getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

export const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeReceiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_registrationFee",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AllocationMismatch",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ApprovalRequired",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CategoryAlreadyFinalized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DuplicateAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DuplicateCategory",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DuplicateTier",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EmptyArray",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExactFeeRequired",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExceedsMaxSupply",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExceedsProposalSupply",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FeeTransferFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientFee",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidBlockNumber",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidMerkleProof",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidRoot",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidTier",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidTierConfig",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidVestingConfig",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MaxTransfersReached",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NativeAmountMismatch",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NativeTransferFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NoUpdatePending",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotAdmin",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotAuthorized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotPassHolder",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NothingToClaim",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PassAlreadyMinted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalAlreadyApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalAlreadyExecuted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalHasExpired",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalNotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalWasRejected",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ProposalsDisabledInCreatorOnlyMode",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RecipientsMismatch",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SameValue",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TierDisable",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Unauthorized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UnexpectedNativeValue",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UpdateAlreadyPending",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UpdateNotReady",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UseMintDirect",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UseMintProposal",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "VaultAlreadyFinalized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "VaultNotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAddress",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            }
        ],
        "name": "CategoryFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "feeAmount",
                "type": "uint256"
            }
        ],
        "name": "FeeCollected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "oldReceiver",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newReceiver",
                "type": "address"
            }
        ],
        "name": "FeeReceiverUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "proposedFee",
                "type": "uint256"
            }
        ],
        "name": "FeeUpdateCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldFee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            }
        ],
        "name": "FeeUpdateExecuted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldFee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "effectiveBlock",
                "type": "uint256"
            }
        ],
        "name": "FeeUpdateProposed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "transferCount",
                "type": "uint256"
            }
        ],
        "name": "GovernanceTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "tier",
                "type": "bytes32"
            }
        ],
        "name": "PassBurned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "tier",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "allocation",
                "type": "uint256"
            }
        ],
        "name": "PassMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isAdmin1",
                "type": "bool"
            }
        ],
        "name": "ProposalApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            }
        ],
        "name": "ProposalCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "ProposalExecuted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "ProposalExpired",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            }
        ],
        "name": "ProposalReadyToMint",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "name": "ProposalRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "claimer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startBlock",
                "type": "uint256"
            }
        ],
        "name": "VaultCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            }
        ],
        "name": "VaultFinalized",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "FEE_UPDATE_DELAY_BLOCKS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_GOVERNANCE_TRANSFERS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "approveMintProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "canTransferGovernance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "cancelFeeUpdate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "tokenIds",
                "type": "uint256[]"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "admin1",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "admin2",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "executor",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "startBlock",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "tier",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "allocationPerPass",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxSupply",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StorageLib.TierConfigInput[]",
                "name": "tierConfigs",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "cliff",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interval",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "initialRelease",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StorageLib.VestingConfigInput[]",
                "name": "vestingConfigs",
                "type": "tuple[]"
            }
        ],
        "name": "createVault",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "executeFeeUpdate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feeReceiver",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "name": "getAdminPendingProposals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "proposer",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin2",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "admin1Approved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "admin2Approved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "rejected",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "expired",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "executed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "proposedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.ProposalInfo[]",
                "name": "proposals",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            }
        ],
        "name": "getCategoryTierDetails",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "tier",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "allocationPerPass",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxSupply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "mintedCount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "remainingSupply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "passHolderCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.TierDetails[]",
                "name": "details",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            }
        ],
        "name": "getCategoryTiers",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentController",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getInvolvedProposals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "proposer",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin2",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "admin1Approved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "admin2Approved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "rejected",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "expired",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "executed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "proposedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.ProposalInfo[]",
                "name": "proposals",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextProposalId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextVaultId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "getOwnerTokenIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPendingFeeUpdate",
        "outputs": [
            {
                "internalType": "bool",
                "name": "hasPending",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "effectiveBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "blocksRemaining",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPlatformStats",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "totalVaults",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalFinalizedVaults",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPassesMinted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalCompletedClaims",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalActivePasses",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDeposited",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalValueLocked",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDistributed",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.PlatformStats",
                "name": "stats",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "getProposalTiers",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "tiers",
                "type": "bytes32[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "merkleRoots",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256[]",
                "name": "remainingSupplies",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "supplyCounts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "mintedCounts",
                "type": "uint256[]"
            },
            {
                "internalType": "bool",
                "name": "admin1Approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "admin2Approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "rejected",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "expired",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "tokenIds",
                "type": "uint256[]"
            }
        ],
        "name": "getUserPasses",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "tier",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "allocation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vested",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "claimed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "claimable",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "locked",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fullyVested",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nextUnlockBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vaultCreatedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vaultStartBlock",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.UserPassInfo[]",
                "name": "passes",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            }
        ],
        "name": "getVaultCategories",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            }
        ],
        "name": "getVaultCategoryAllocations",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "category",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalMinted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalClaimed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "remainingPasses",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "finalized",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tierCount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "vestingEnabled",
                        "type": "bool"
                    }
                ],
                "internalType": "struct ViewModule.CategoryAllocation[]",
                "name": "allocations",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "startId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "name": "getVaultSummaries",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin2",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "executor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDeposited",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalClaimed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "finalized",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "categoryCount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPassesMinted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalCompletedClaims",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalActivePasses",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.VaultSummary[]",
                "name": "summaries",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "getVaultSummariesByCreator",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin2",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "executor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDeposited",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalClaimed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "finalized",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "categoryCount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPassesMinted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalCompletedClaims",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalActivePasses",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.VaultSummary[]",
                "name": "summaries",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            }
        ],
        "name": "getVaultSummary",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "vaultId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "admin2",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "executor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDeposited",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalClaimed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "finalized",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "categoryCount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPassesMinted",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalCompletedClaims",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalActivePasses",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.VaultSummary",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            }
        ],
        "name": "getVestingSchedule",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "enabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "cliff",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interval",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "initialRelease",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "cliffEndBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "vestingEndBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nextUnlockBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "percentVested",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ViewModule.VestingSchedule",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "governanceActivated",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "governanceContract",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "governanceTransferCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isFeeUpdateReady",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "tier",
                "type": "bytes32"
            },
            {
                "internalType": "address[]",
                "name": "recipients",
                "type": "address[]"
            }
        ],
        "name": "mintDirect",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "tier",
                "type": "bytes32"
            },
            {
                "internalType": "address[]",
                "name": "recipients",
                "type": "address[]"
            },
            {
                "internalType": "bytes32[][]",
                "name": "proofs",
                "type": "bytes32[][]"
            }
        ],
        "name": "mintPasses",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingFeeUpdate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "effectiveBlock",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "pending",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newFee",
                "type": "uint256"
            }
        ],
        "name": "proposeFeeUpdate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "vaultId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "category",
                "type": "bytes32"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "tier",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "merkleRoot",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "supplyCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StorageLib.TierBatchInput[]",
                "name": "tierBatches",
                "type": "tuple[]"
            }
        ],
        "name": "proposeMintCategory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "registrationFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "rejectMintProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "remainingGovernanceTransfers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newGovernance",
                "type": "address"
            }
        ],
        "name": "transferToGovernance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newReceiver",
                "type": "address"
            }
        ],
        "name": "updateFeeReceiver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;