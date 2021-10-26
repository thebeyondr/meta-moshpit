const main = async () => {
    const [owner, randomMosher] = await hre.ethers.getSigners();
    const moshPitFactory = await hre.ethers.getContractFactory('MoshPit');
    const moshPitContract = await moshPitFactory.deploy();
    await moshPitContract.deployed();

    console.log('Contract deployed to: ', moshPitContract.address);
    console.log('Contract deployed by: ', owner.address);

    let trackCount;
    trackCount = await moshPitContract.getTotalTracks();

    const addTrackTxn = await moshPitContract.addTrack();
    await addTrackTxn.wait();

    trackCount = await moshPitContract.getTotalTracks();

    addTrackTx = await moshPitContract.connect(randomMosher).addTrack();
    await addTrackTxn.wait();
    trackCount = await moshPitContract.getTotalTracks();

    let userTrack;
    userTrack = await moshPitContract.getTotalUserTracks();
    userTrack = await moshPitContract
        .connect(randomMosher)
        .getTotalUserTracks();
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
