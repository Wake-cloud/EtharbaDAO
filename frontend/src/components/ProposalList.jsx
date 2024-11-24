import React, { useState, useEffect } from "react";

const ProposalList = ({ contract }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const totalProposals = await contract.nextProposalId();
        const proposalsArray = [];

        for (let i = 0; i < totalProposals; i++) {
          const proposal = await contract.getProposal(i);
          proposalsArray.push(proposal);
        }

        setProposals(proposalsArray);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contract]);

  return (
    <div>
      <h3>Proposal List</h3>
      {loading ? (
        <p>Loading proposals...</p>
      ) : (
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              {proposal.description} - Status: {proposal.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposalList;
