import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import abi from './utils/MoshPit.json';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [allTracks, setAllTracks] = useState([]);
    const [showForm, updateShowForm] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newArtist, setNewArtist] = useState('');

    const [mining, setMining] = useState(false);

    const contractAddress = `${process.env.REACT_APP_MOSHPIT_CONTRACT_DEPLOY}`;
    const contractABI = abi.abi;

    const formatAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-3)}`;
    };

    const displayForm = () => {
        updateShowForm(true);
    };

    const hideForm = () => {
        updateShowForm(false);
    };

    // const checkENS = (address) => {
    //     const { ethereum } = window;

    //     if (!ethereum) return;
    //     const provider = ethers.providers.Web3Provider(ethereum);
    //     provider.lookUpAddress
    //     provider.resolveName('')
    // }
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
                    "You'll need an Ethereum wallet to submit your song! Try https://metamask.io/"
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
        // if (!newArtist || !newTitle) return;
        try {
            const { ethereum } = window;

            if (ethereum) {
                setMining(true);
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
                    newTitle.trim(),
                    newArtist.trim()
                );
                // console.log('Mining..', songTxn.hash);

                await songTxn.wait();
                console.log('Mined --', songTxn.hash);

                getAllTracks();
                setNewArtist('');
                setNewTitle('');
                hideForm();
                setMining(false);
                // count = await moshPitContract.getTotalTracks();
                // console.log('Retrieved total tracks added:', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            '🕯',
            '🩸',
            '🦄',
            '🌿',
        ];
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const moshPitContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    provider
                );

                const tracks = await moshPitContract.getAllTracks();

                let tracksCleaned = tracks.map((track) => ({
                    address: track.mosher,
                    timestamp: new Date(track.timestamp * 1000),
                    title: track.title,
                    artist: track.artist,
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

    useEffect(() => {
        getAllTracks();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <main className="container mx-auto px-4 pt-12 max-w-md">
                <h1 className="text-transparent bg-gradient-to-br from-red-600 to-purple-600 bg-clip-text font-bold text-6xl">
                    moshpit!
                </h1>

                <p className="opacity-70">by ~vnqsh.</p>

                <p className="pt-3">Add your favorite rock bangers.</p>

                <div className="pt-12">
                    {allTracks &&
                        allTracks.map((track, index) => {
                            return (
                                <div
                                    key={index}
                                    className="mb-4 border-2 border-purple-100 border-opacity-30 rounded-md px-5 py-3"
                                >
                                    <div className="font-display font-bold text-xl tracking-wider">
                                        {track.title}
                                    </div>
                                    <div className="font-mono text-base text-white text-opacity-80">
                                        {track.artist}
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <p className="text-red-500 text-xs">
                                            {track.emoji}{' '}
                                        </p>
                                        <div className="pl-2">
                                            <p className="text-white text-xs text-opacity-70">
                                                from{' '}
                                                {formatAddress(track.address)}
                                                {' • '}
                                                {new Intl.DateTimeFormat(
                                                    navigator.languages,
                                                    {
                                                        dateStyle: 'medium',
                                                    }
                                                ).format(track.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                {/* </div> */}
            </main>
            <div className="container max-w-lg mx-auto fixed bottom-0 right-0 left-0 p-4 bg-gradient-to-r from-red-600 to-purple-800 rounded-t-lg">
                {currentAccount && (
                    <div className="flex justify-between items-center">
                        <div className="bg-purple-900 bg-opacity-60 rounded-full flex items-center py-3 px-4">
                            <span className="flex h-2 w-2 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                            </span>
                            <p className="text-xs">
                                Connected to {formatAddress(currentAccount)}{' '}
                            </p>
                        </div>
                        {showForm && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                onClick={hideForm}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        )}
                        {currentAccount && !showForm && (
                            <button
                                onClick={displayForm}
                                className="border-b-2 my-3"
                            >
                                Add track
                            </button>
                        )}
                    </div>
                )}
                {showForm && (
                    <div className="pt-6">
                        <div className="text-left">
                            <label
                                className="block text-white text-base mb-2"
                                htmlFor="title"
                            >
                                Song title
                            </label>
                            <input
                                className="shadow appearance-none border rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:shadow-md mb-4"
                                id="title"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Castaways"
                            />

                            <label
                                className="block text-white text-base mb-2"
                                htmlFor="artist"
                            >
                                Artist
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:shadow-md"
                                id="artist"
                                type="text"
                                value={newArtist}
                                onChange={(e) => setNewArtist(e.target.value)}
                                placeholder="The Backyardigans"
                            />
                        </div>
                        <button
                            type="button"
                            className="mt-4 bg-black text-white w-full rounded-lg py-3 bg-opacity-40 shadow-sm flex justify-center"
                            onClick={addTrack}
                            disabled={mining}
                        >
                            {mining && (
                                <div className="animate-bounce text-md mr-3">
                                    💽
                                </div>
                            )}
                            {mining ? 'Adding your track...' : 'Add your track'}
                        </button>
                    </div>
                )}
                {!currentAccount && (
                    <div className="text-center">
                        <button
                            onClick={connectWallet}
                            className="border-b-2 text-sm self-center"
                        >
                            Connect your wallet to add tracks 🔌
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
