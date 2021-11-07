import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
import './App.css';

export default function App() {
    const addSong = () => {};
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        try {
            // Check if we can access window.ethereum
            const { ethereum } = window;

            if (!ethereum) {
                console.log("You'll need a wallet to interact! Try MetaMask!");
                return;
            } else {
                console.log('We have the ethereum object!', ethereum);
            }

            // Check if we can access the user's wallet
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account', account);
                setCurrentAccount(account);
            } else {
                console.error('No authorized account found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert(
                    "You'll need an Ethereum wallet like MetaMask to submit your song!"
                );
                return;
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log('🔌 Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">🔥 GREETINGS, MORTAL 🔥</div>

                <div className="bio">
                    Join the MoshPit and deliver unto us thine banger as a link.
                </div>

                {/* <button className="waveButton" onClick={addSong}>
                    Add your song
                </button> */}
                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect wallet
                    </button>
                )}
            </div>
        </div>
    );
}
