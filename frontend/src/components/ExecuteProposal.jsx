import React, { useState } from "react";

const ExecuteProposal = ({ contract, signer }) => {
  const [proposalId, setProposalId] = useState("");

  const handleExecuteProposal = async () => {
    if (!signer || !proposalId) return;

    try {
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
      console.log(`Executed proposal ${proposalId} successfully!`);
    } catch (error) {
      console.error("Error executing proposal:", error);
    }
  };

  return (
    <div>
      <h3>Execute Proposal</h3>
      <input
        type="number"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Enter proposal ID"
      />
      <button onClick={handleExecuteProposal}>Execute Proposal</button>
    </div>
  );
};

export default ExecuteProposal;
