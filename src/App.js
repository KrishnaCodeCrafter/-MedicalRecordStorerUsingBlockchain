import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadProvider,
  loadNetwork,
  loadMedical,
  subscribeToEvents,
  loadAllData,
  loadAccount
} from './store/interactions';
import { Form, Navbar, Option, Data, Alert } from './components';
import config from "./config.json";
import { Routes, Route } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.connection);

  // Load blockchain data once
  useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = loadProvider(dispatch);
      const chainId = await loadNetwork(provider, dispatch);

      const medical_config = config[String(chainId)]?.MedicalRecord;
      if (!medical_config) {
        console.error(`MedicalRecord config not found for chainId ${chainId}`);
        return;
      }

      const medical = await loadMedical(provider, medical_config.address, dispatch);
      await loadAllData(provider, medical, dispatch);
      subscribeToEvents(medical, dispatch);
    };

    loadBlockchainData();
  }, [dispatch]);

  // MetaMask listeners for account and network change
  useEffect(() => {
    if (!window.ethereum || !provider) return;

    const handleAccountsChanged = () => {
      loadAccount(provider, dispatch);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [provider, dispatch]);

  return (
    <div className="App">
      <Navbar />
      <Option />
      <Routes>
        <Route path="/" exact element={<Form />} />
        <Route path="/Data" exact element={<Data />} />
      </Routes>
      <Alert />
    </div>
  );
}

export default App;
