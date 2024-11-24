// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

// DAO Contract for Etharba Foundation with Upgradability and Security Features
contract EtharbaDAO is Initializable, Ownable {
    using SafeMath for uint256;

    IERC20 public ethArbaToken;  // ERC20 token that will be used for voting
    uint256 public transactionFee; // Fee in percentage (e.g., 1 for 1%)
    uint256 public totalSupply; // Total supply of Etharba tokens (to be divided)
    address public treasury; // Treasury address for collected fees

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 voteCountFor;
        uint256 voteCountAgainst;
        uint256 endTime;
        bool executed;
        bool exists;
    }

    // Mapping of proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    // Mapping of token holders' votes
    mapping(address => uint256) public tokenBalances;
    mapping(address => mapping(uint256 => bool)) public voted;

    // Delegation mappings
    mapping(address => address) public delegate;
    mapping(address => uint256) public delegatedVotes;

    // Event declarations
    event ProposalCreated(uint256 id, address proposer, string description);
    event Voted(address voter, uint256 proposalId, bool vote);
    event ProposalExecuted(uint256 id);
    event TransactionFeeChanged(uint256 newFee);
    event DelegateChanged(address delegator, address delegatee);
    event FeeWithdrawn(address to, uint256 amount);

    modifier onlyTokenHolders() {
        require(ethArbaToken.balanceOf(msg.sender) > 0, "Must have Etharba tokens to participate");
        _;
    }

    modifier onlyGovernance() {
        require(msg.sender == owner() || msg.sender == delegate[owner()], "Not authorized");
        _;
    }

    modifier onlyVotingPower(address voter) {
        require(ethArbaToken.balanceOf(voter) > 0 || delegate[voter] != address(0), "No voting power");
        _;
    }

    constructor(IERC20 _ethArbaToken, uint256 _initialFee, address _treasury) {
        ethArbaToken = _ethArbaToken;
        transactionFee = _initialFee;
        treasury = _treasury;
    }

    // Initialize contract for upgradability
    function initialize(IERC20 _ethArbaToken, uint256 _initialFee, address _treasury) external initializer {
        ethArbaToken = _ethArbaToken;
        transactionFee = _initialFee;
        treasury = _treasury;
    }

    // Set the transaction fee (only owner can do this)
    function setTransactionFee(uint256 _fee) external onlyGovernance {
        require(_fee <= 100, "Fee cannot be more than 100%");
        transactionFee = _fee;
        emit TransactionFeeChanged(_fee);
    }

    // Function to create a new proposal
    function createProposal(string calldata _description) external onlyTokenHolders {
        uint256 proposalId = nextProposalId;
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            voteCountFor: 0,
            voteCountAgainst: 0,
            endTime: block.timestamp + 1 weeks,  // Voting period of 1 week
            executed: false,
            exists: true
        });

        nextProposalId++;
        emit ProposalCreated(proposalId, msg.sender, _description);
    }

    // Function for token holders to vote
    function vote(uint256 _proposalId, bool _vote) external onlyVotingPower(msg.sender) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!voted[msg.sender][_proposalId], "Already voted on this proposal");

        uint256 voterBalance = ethArbaToken.balanceOf(msg.sender);
        uint256 votingPower = voterBalance;
        
        // If delegated, use the delegated voting power
        if (delegate[msg.sender] != address(0)) {
            votingPower = delegatedVotes[delegate[msg.sender]];
        }

        require(votingPower > 0, "Insufficient tokens to vote");

        // Record that this user has voted
        voted[msg.sender][_proposalId] = true;

        if (_vote) {
            proposal.voteCountFor = proposal.voteCountFor.add(votingPower);
        } else {
            proposal.voteCountAgainst = proposal.voteCountAgainst.add(votingPower);
        }

        emit Voted(msg.sender, _proposalId, _vote);
    }

    // Function to execute the proposal if it's passed
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp >= proposal.endTime, "Voting period hasn't ended yet");
        require(!proposal.executed, "Proposal already executed");

        // Compare vote counts to decide if the proposal passes
        uint256 totalVotes = proposal.voteCountFor.add(proposal.voteCountAgainst);
        uint256 passingVotes = totalVotes.div(2);

        // If it passes (majority votes in favor)
        if (proposal.voteCountFor > passingVotes) {
            // Execute the proposal (for now, it's just an example)
            // Example: maybe the proposal means sending tokens or changing some DAO parameter
            // (this can be expanded to support more actions as needed)
            // For simplicity, we will just emit an event here:
            emit ProposalExecuted(_proposalId);
        }

        proposal.executed = true;
    }

    // Delegate voting power to another address
    function delegateVotingPower(address _delegatee) external onlyTokenHolders {
        require(_delegatee != msg.sender, "Cannot delegate to yourself");
        delegate[msg.sender] = _delegatee;
        delegatedVotes[_delegatee] = delegatedVotes[_delegatee].add(ethArbaToken.balanceOf(msg.sender));
        emit DelegateChanged(msg.sender, _delegatee);
    }

    // Function to process transaction fees
    function processTransactionFee(uint256 _amount) external {
        uint256 feeAmount = _amount.mul(transactionFee).div(100);
        require(ethArbaToken.transferFrom(msg.sender, treasury, feeAmount), "Fee transfer failed");
    }

    // Function to withdraw collected fees
    function withdrawFees(uint256 _amount) external onlyOwner {
        payable(treasury).transfer(_amount);
        emit FeeWithdrawn(treasury, _amount);
    }

    // Get total votes (for admin to know their voting power)
    function getVotingPower(address voter) external view returns (uint256) {
        uint256 balance = ethArbaToken.balanceOf(voter);
        uint256 delegatedBalance = delegatedVotes[voter];
        return balance.add(delegatedBalance);
    }
}
