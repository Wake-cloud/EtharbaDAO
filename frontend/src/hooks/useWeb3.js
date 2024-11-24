// src/hooks/useWeb3.js

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [active, setActive] = useState(false);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request user to connect wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setActive(true);
      } catch (error) {
        console.log(error);
        alert("Could not connect to wallet");
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  // Disconnect the wallet
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setActive(false);
  };

  useEffect(() => {
    // Automatically connect to wallet if already connected (optional)
    if (window.ethereum && !account) {
      const initConnection = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setActive(true);
      };
      initConnection();
    }
  }, [account]);

  return {
    connectWallet,
    disconnectWallet,
    account,
    provider,
    signer,
    active,
  };
};

export default useWeb3;
