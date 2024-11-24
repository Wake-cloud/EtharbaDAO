import { useState, useEffect } from "react";
import { ethers } from "ethers";

const VotingPower = ({ contract, signer }) => {
  const [votingPower, setVotingPower] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotingPower = async () => {
      try {
        // Ensure contract and signer are available
        if (!contract || !signer) {
          setError("Contract or signer is not available.");
          return;
        }

        // Fetch the raw voting power from the contract
        const rawVotingPower = await contract.getVotingPower(await signer.getAddress());

        // Log the raw voting power to see what you're getting
        console.log("Raw Voting Power from contract:", rawVotingPower);

        // Check if rawVotingPower is undefined or null
        if (rawVotingPower === undefined || rawVotingPower === null) {
          setError("Voting power data is unavailable.");
          return;
        }

        // Check if rawVotingPower is BigInt or a valid string/number
        let votingPower;
        if (typeof rawVotingPower === "bigint") {
          // Convert BigInt to BigNumber
          votingPower = ethers.BigNumber.from(rawVotingPower.toString());
        } else if (typeof rawVotingPower === "string" || typeof rawVotingPower === "number") {
          // If it's a string or number, pass it directly to BigNumber
          votingPower = ethers.BigNumber.from(rawVotingPower);
        } else {
          setError("Invalid voting power format.");
          return;
        }

        // Format the voting power for display (assuming 18 decimals)
        const formattedVotingPower = ethers.utils.formatUnits(votingPower, 18);
        setVotingPower(formattedVotingPower);
        setError(null);  // Clear any previous errors
      } catch (err) {
        console.error("Error fetching or formatting voting power:", err);
        setError("Error fetching or formatting voting power.");
      }
    };

    if (contract && signer) {
      fetchVotingPower();
    }
  }, [contract, signer]);  // Dependencies to refetch when contract or signer changes

  return (
    <div>
      <h4>Your Voting Power:</h4>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{votingPower ? votingPower : "Loading..."}</p>
      )}
    </div>
  );
};

export default VotingPower;
