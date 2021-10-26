const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());

    const moshPitFactory = await hre.ethers.getContractFactory('MoshPit');
    const moshPitContract = await moshPitFactory.deploy();
    await moshPitContract.deployed();

    console.log('Contract deployed to: ', moshPitContract.address);
};

const deploy = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

deploy();
