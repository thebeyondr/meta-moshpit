import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';

export default function App() {
    const wave = () => {};

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">🔥 GREETINGS, MORTAL 🔥</div>

                <div className="bio">
                    Join the MoshPit and deliver unto us thine banger as a link.
                </div>

                <button className="waveButton" onClick={wave}>
                    BESTOW THINE TRACK
                </button>
            </div>
        </div>
    );
}
