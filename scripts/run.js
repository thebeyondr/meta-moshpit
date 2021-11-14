const main = async () => {
    const moshPitFactory = await hre.ethers.getContractFactory('MoshPit');
    const moshPitContract = await moshPitFactory.deploy();
    await moshPitContract.deployed();

    console.log('Contract deployed to: ', moshPitContract.address);

    let trackCount;
    trackCount = await moshPitContract.getTotalTracks();
    console.log('total tracks ', trackCount.toNumber());

    let addTrackTxn = await moshPitContract.addTrack(
        'Nirvana - Smells Like Teen Spirit'
    );
    await addTrackTxn.wait(); // wait for the transaction to be mined

    // trackCount = await moshPitContract.getTotalTracks();

    const [_, randomMosher] = await hre.ethers.getSigners();
    addTrackTxn = await moshPitContract
        .connect(randomMosher)
        .addTrack('Metallica - Enter Sandman');
    await addTrackTxn.wait();
    console.log('Got to random add txn');
    // trackCount = await moshPitContract.getTotalTracks();

    let allWaves = await moshPitContract.getAllTracks();
    console.log(allWaves);
    // userTrack = await moshPitContract.getTotalUserTracks();
    // userTrack = await moshPitContract
    //     .connect(randomMosher)
    //     .getTotalUserTracks();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
