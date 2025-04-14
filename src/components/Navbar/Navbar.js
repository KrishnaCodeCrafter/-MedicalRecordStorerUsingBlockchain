import React from "react";
import "./navbar.css";
import healthReport from "../../assets/health-report.png";
import { useDispatch, useSelector } from "react-redux";
import { loadAccount } from "../../store/interactions";
import Blockies from "react-blockies";
import config from "../../config.json";

const Navbar = () => {
    const dispatch = useDispatch();
    const provider = useSelector((state) => state.provider.connection);
    const account = useSelector((state) => state.provider.account);
    const balance = useSelector((state) => state.provider.balance);
    const chainId = useSelector((state) => state.provider.chainId);

    const connectHandler = async () => {
        await loadAccount(provider, dispatch);
    };

    const networkHandler = async (e) => {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: e.target.value }],
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar__brand">
                <img src={healthReport} alt="Health Report" />
                <h1>Medical Record Storer</h1>
            </div>
            <div className="navbar__network">
                <select onChange={networkHandler} value={config[chainId] ? `0x${chainId.toString(16)}` : "0"}>
                    <option value="0" disabled>Select Network</option>
                    <option value="0x7a69">Localhost</option>
                    <option value="0xaa36a7">Sepolia</option>
                </select>
            </div> 
            <div className="navbar__account">
                <div className="navbar__balance">
                    <span>Balance:</span>
                    <strong>{balance ? `${Number(balance).toFixed(4)} ETH` : "0 ETH"}</strong>
                </div>
                {account ? (
                    <div className="navbar__address">
                        <Blockies seed={account} size={10} scale={3} className="identicon" />
                        <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                    </div>
                ) : (
                    <button className="navbar__connect" onClick={connectHandler}>
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
