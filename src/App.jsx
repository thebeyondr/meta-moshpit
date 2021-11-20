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

    // console.log(getRandomRockEmoji());
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
        const emojiDictionary = [
            '🤘',
            '😈',
            '🎸',
            '🌠',
            '🐐',
            '💀',
            '☠',
            '⛧',
            '⚰️',
            '⁶⁶⁶',
            '⸸',
            'ψ',
            '👁',
            '⚡',
            '🌬',
            '🩸',
            '🦄',
            '🌿',
        ];
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
                    emoji: emojiDictionary[
                        Math.floor(Math.random() * emojiDictionary.length)
                    ],
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
    }, []);

    return (
        <>
            <main className="container mx-auto px-4 pt-16">
                {/* <div className="dataContainer"> */}
                <h1 className="font-display text-3xl">meta-moshpit.</h1>
                <p className="font-display opacity-70">by ~vnqsh.</p>

                <p className="pt-6">💥 Add your favorite rock bangers.</p>

                <div className="pt-3">
                    {allTracks &&
                        allTracks.map((track, index) => {
                            return (
                                <div
                                    key={index}
                                    className="mt-2 border-2 border-white  border-opacity-30 rounded-md p-3"
                                >
                                    <div className="font-display text-base">
                                        {track.message}
                                    </div>
                                    <div className="flex">
                                        {track.emoji}{' '}
                                        <div className="text-white text-opacity-70 pl-2">
                                            {formatAddress(track.address)}
                                            {' • '}
                                            {new Intl.DateTimeFormat(
                                                'en-US'
                                            ).format(track.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                {/* </div> */}
            </main>
            <div className="fixed bottom-0 p-4  bg-gradient-to-r from-red-600 to-purple-800 w-full backdrop-filter backdrop-blur-sm bg-opacity-50 text-center rounded-t-lg">
                {currentAccount && (
                    <div className="bg-purple-800 bg-opacity-40 rounded-full flex items-center w-56 px-3 py-2">
                        <span className="flex h-3 w-3 relative mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
                        </span>
                        <p>Connected to {formatAddress(currentAccount)} </p>
                    </div>
                )}
                {currentAccount && (
                    <div className="pt-6">
                        <div className="text-left">
                            <p>Song title</p>
                            <input
                                type="text"
                                className="rounded-lg p-3 w-full font-sans placeholder-blue-300"
                                placeholder="Castaways"
                            />
                        </div>
                        <div className="text-left">
                            <p>Artist</p>
                            <input
                                type="text"
                                className="rounded-lg p-3 w-full font-sans"
                                placeholder="The Backyardigans"
                            />
                        </div>
                        <button
                            type="button"
                            className="border-b-2"
                            onClick={addTrack}
                        >
                            ADD YOUR TRACK
                        </button>
                    </div>
                )}
                {!currentAccount && (
                    <button onClick={connectWallet} className="border-b-2">
                        Connect your wallet to add tracks 🔌
                    </button>
                )}
            </div>
        </>
    );
}
