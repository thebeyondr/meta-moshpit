import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

import abi from './utils/MoshPit.json';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');

    const contractAddress = process.env.REACT_APP_MOSHPIT_CONTRACT_DEPLOY;
    const contractABI = abi.abi;

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

    const addSong = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const moshPitContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let count = await moshPitContract.getTotalTracks();
                console.log('Retrieved total tracks added:', count.toNumber());

                const songTxn = await moshPitContract.addTrack();
                console.log('Mining..', songTxn.hash);

                await songTxn.wait();
                console.log('Mined --', songTxn.hash);

                count = await moshPitContract.getTotalTracks();
                console.log('Retrieved total tracks added:', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
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

                <button className="waveButton" onClick={addSong}>
                    Add your song
                </button>
                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect wallet
                    </button>
                )}
            </div>
        </div>
    );
}
