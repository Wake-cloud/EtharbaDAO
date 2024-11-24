import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { EtharbaDAO_ABI, EtharbaDAO_ADDRESS } from "./contract"; // Import contract ABI and address
import './App.css'

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [ethArbaDAO, setEthArbaDAO] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [transactionFee, setTransactionFee] = useState(0);
  const [newProposalDescription, setNewProposalDescription] = useState("");
  const [votingPower, setVotingPower] = useState(0);
  const [delegation, setDelegation] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then(accounts => setAccount(accounts[0]))
        .catch(error => console.error(error));

      const daoContract = new web3Instance.eth.Contract(EtharbaDAO_ABI, EtharbaDAO_ADDRESS);
      setEthArbaDAO(daoContract);
    } else {
      console.error("Please install MetaMask!");
    }
  }, []);

  const fetchProposals = async () => { /* Logic */ };
  const fetchVotingPower = async () => { /* Logic */ };

  return (
    <div>
      <h1>Etharba DAO</h1>
      <p><strong>Connected Account:</strong> {account || "Not connected"}</p>
      <p><strong>Voting Power:</strong> {votingPower}</p>
      <p><strong>Transaction Fee:</strong> {transactionFee}%</p>

      <div>
        <h3>Create Proposal</h3>
        <input
          type="text"
          placeholder="Proposal Description"
          value={newProposalDescription}
          onChange={(e) => setNewProposalDescription(e.target.value)}
        />
        <button onClick={() => console.log("Creating proposal")}>Create Proposal</button>
      </div>

      <div>
        <h3>Proposals</h3>
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              <p>{proposal.description}</p>
              <p>For: {proposal.voteCountFor} - Against: {proposal.voteCountAgainst}</p>
              <button>Vote For</button>
              <button>Vote Against</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Delegate Voting Power</h3>
        <input
          type="text"
          placeholder="Delegatee Address"
          onChange={(e) => console.log("Delegating to", e.target.value)}
        />
        <p>Current Delegatee: {delegation || "None"}</p>
      </div>
    </div>
  );
}

export default App;
