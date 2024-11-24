import React, { useState } from "react";

const CancelProposal = ({ contract, signer }) => {
  const [proposalId, setProposalId] = useState("");

  const handleCancelProposal = async () => {
    if (!signer || !proposalId) return;

    try {
      const tx = await contract.cancelProposal(proposalId);
      await tx.wait();
      console.log(`Proposal ${proposalId} cancelled successfully!`);
    } catch (error) {
      console.error("Error cancelling proposal:", error);
    }
  };

  return (
    <div>
      <h3>Cancel Proposal</h3>
      <input
        type="number"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Enter proposal ID"
      />
      <button onClick={handleCancelProposal}>Cancel Proposal</button>
    </div>
  );
};

export default CancelProposal;
