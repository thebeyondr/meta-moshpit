import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
// import './App.css';

import abi from './utils/MoshPit.json';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [allTracks, setAllTracks] = useState([]);
    // const [isAddingTrack, updateAddingTrack] = useState(false);

    const contractAddress = `${process.env.REACT_APP_MOSHPIT_CONTRACT_DEPLOY}`;
    const contractABI = abi.abi;

    const formatAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-3)}`;
    };

    // const checkIfWalletIsConnected = async () => {
    //     try {
    //         // Check if we can access window.ethereum
    //         const { ethereum } = window;

    //         if (!ethereum) {
    //             console.log("You'll need a wallet to interact! Try MetaMask!");
    //             return;
    //         } else {
    //             console.log('We have the ethereum object!', ethereum);
    //         }

    //         // Check if we can access the user's wallet
    //         const accounts = await ethereum.request({ method: 'eth_accounts' });
    //         if (accounts.length !== 0) {
    //             const account = accounts[0];
    //             console.log('Found an authorized account', account);
    //             setCurrentAccount(account);
    //             getAllTracks();
    //         } else {
    //             console.error('No authorized account found');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

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

    const addTrack = async () => {
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

                const songTxn = await moshPitContract.addTrack(
                    'Normandy - Storm the walls'
                );
                console.log('Mining..', songTxn.hash);

                await songTxn.wait();
                console.log('Mined --', songTxn.hash);

                getAllTracks();
                // count = await moshPitContract.getTotalTracks();
                // console.log('Retrieved total tracks added:', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const getTotalTracks = async () => {
    //     try {
    //         const { ethereum } = window;

    //         if (ethereum) {
    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             const signer = provider.getSigner();
    //             const moshPitContract = new ethers.Contract(
    //                 contractAddress,
    //                 contractABI,
    //                 signer
    //             );

    //             let count = await moshPitContract.getTotalTracks();
    //             console.log('total tracks added:', count.toNumber());
    //             setAllTracks(count.toNumber());
    //         } else {
    //             console.log("Ethereum object doesn't exist!");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const getAllTracks = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                // const signer = provider.getSigner();
                const moshPitContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    provider
                );

                const tracks = await moshPitContract.getAllTracks();

                let tracksCleaned = tracks.map((track) => ({
                    address: track.mosher,
                    timestamp: new Date(track.timestamp * 1000),
                    message: track.message,
                }));

                setAllTracks(tracksCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // if (prevAccount !== currentAccount) {
    //     checkIfWalletIsConnected();
    // }
    // useEffect(() => {
    //     checkIfWalletIsConnected();
    // }, []);

    useEffect(() => {
        getAllTracks();
    });

    return (
        <main className="container mx-auto px-4 pt-4">
            {/* <div className="dataContainer"> */}
            <h1>META MOSHPIT</h1>

            <div className="bio">
                Deliver unto us thine metal/rock/metalcore banger as a link.
            </div>
            <div className="bio">
                ⚡ Total tracks added — {allTracks.length}
            </div>

            <button
                type="button"
                className="bg-red-500 py-2 px-4 rounded-md text-white font-semibold text-opacity-80"
                onClick={addTrack}
            >
                ADD YOUR TRACK
            </button>
            {!currentAccount && (
                <button className="waveButton" onClick={connectWallet}>
                    Connect wallet
                </button>
            )}
            <div className="pt-6">
                {allTracks &&
                    allTracks.map((track, index) => {
                        return (
                            <div
                                key={index}
                                className="mt-2 border-2 border-white  border-opacity-30 rounded-md p-3"
                            >
                                <div className="font-semibold text-lg">
                                    {track.message}
                                </div>
                                <div>
                                    from {formatAddress(track.address)}
                                    {' @ '}
                                    {new Intl.DateTimeFormat('en-US').format(
                                        track.timestamp
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
            {/* </div> */}
        </main>
    );
}
