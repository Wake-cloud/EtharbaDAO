import React, { useState } from "react";

const CreateProposal = ({ contract, signer }) => {
  const [description, setDescription] = useState("");

  const handleCreateProposal = async () => {
    if (!signer || !description) return;

    try {
      const tx = await contract.createProposal(description);
      await tx.wait();
      console.log("Proposal created successfully!");
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  return (
    <div>
      <h3>Create a New Proposal</h3>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter proposal description"
      />
      <button onClick={handleCreateProposal}>Create Proposal</button>
    </div>
  );
};

export default CreateProposal;
