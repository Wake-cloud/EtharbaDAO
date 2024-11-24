import React, { useState } from "react";

const VoteOnProposal = ({ contract, signer }) => {
  const [proposalId, setProposalId] = useState("");
  const [vote, setVote] = useState(null); // "for" or "against"

  const handleVote = async () => {
    if (!signer || !proposalId || vote === null) return;

    try {
      const tx = await contract.vote(proposalId, vote);
      await tx.wait();
      console.log(`Voted ${vote} on proposal ${proposalId}`);
    } catch (error) {
      console.error("Error voting on proposal:", error);
    }
  };

  return (
    <div>
      <h3>Vote on a Proposal</h3>
      <input
        type="number"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Enter proposal ID"
      />
      <div>
        <button onClick={() => setVote("for")}>Vote For</button>
        <button onClick={() => setVote("against")}>Vote Against</button>
      </div>
      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
};

export default VoteOnProposal;
