const MasterDeployFactory = require("../abi/MasterFactory.json");
const { ethers } = require("ethers");

const masterDeployFactoryAddress = "0x7727138ccfb6a94E4Cb4Fca8a4D1aa580C616155";

export async function main(
    memberTypeNames,
    executivePermissionNames,
    POname,
    quadraticVotingEnabled,
    democracyVoteWeight,
    participationVoteWeight,
    hybridVotingEnabled,
    participationVotingEnabled,
    electionEnabled,
    educationHubEnabled,
    logoURL,
    infoIPFSHash,
    votingControlType,
    quorumPercentageDD,
    quorumPercentagePV,
    username,
    wallet
  ) {
    console.log("Creating new DAO...");
    console.log("Input parameters:", {
      memberTypeNames,
      executivePermissionNames,
      POname,
      quadraticVotingEnabled,
      democracyVoteWeight,
      participationVoteWeight,
      hybridVotingEnabled,
      participationVotingEnabled,
      electionEnabled,
      educationHubEnabled,
      logoURL,
      infoIPFSHash,
      votingControlType,
      quorumPercentageDD,
      quorumPercentagePV,
    });

    // Initialize contract names dynamically based on enabled features, ensuring proper order
    let contractNames = [
      "NFTMembership",           // Always first
      "DirectDemocracyToken",    // Always second
      "ParticipationToken",      // Always third
      "Treasury",                // Always fourth
      "DirectDemocracyVoting",   // Always fifth
    ];

    // Depending on voting, insert "HybridVoting" or "ParticipationVoting" in the proper position
    if (hybridVotingEnabled) {
      contractNames.push("HybridVoting");  // Added after DirectDemocracyVoting
    } else if (participationVotingEnabled) {
      contractNames.push("ParticipationVoting");  // Added after DirectDemocracyVoting
    }

    // Always add TaskManager after voting mechanisms
    contractNames.push("TaskManager");

    // Add Election if enabled
    if (electionEnabled) {
      contractNames.push("Election");
    }

    // Add EducationHub if enabled
    if (educationHubEnabled) {
      contractNames.push("EducationHub");
    }

    // Always add QuickJoin at the end
    contractNames.push("QuickJoin");

    // Construct params object to pass to the deployAll function
    const params = {
      memberTypeNames,
      executivePermissionNames,
      POname,
      quadraticVotingEnabled,
      democracyVoteWeight: ethers.BigNumber.from(democracyVoteWeight),
      participationVoteWeight: ethers.BigNumber.from(participationVoteWeight),
      hybridVotingEnabled,
      participationVotingEnabled,
      logoURL,
      infoIPFSHash,
      votingControlType,
      contractNames,  // Contract names are now aligned properly
      quorumPercentageDD: ethers.BigNumber.from(quorumPercentageDD),
      quorumPercentagePV: ethers.BigNumber.from(quorumPercentagePV),
      username,
      electionEnabled,
      educationHubEnabled,
    };

    console.log("Deploying new DAO with the following parameters:", params);



    const masterDeployer = new ethers.Contract(masterDeployFactoryAddress, MasterDeployFactory.abi, wallet);
    const gasLimit = ethers.utils.hexlify(15500000);

        // Create the contract instance and define gas limits
        const gasEstimate = await masterDeployer.estimateGas.deployAll(params);
        console.log("Estimated gas: ", gasEstimate.toString());

    const options = {
      gasLimit: gasLimit,
    };

    try {
      const tx = await masterDeployer.deployAll(params, options);
      const receipt = await tx.wait();

      console.log("Deployment transaction was successful!");
      console.log("Transaction hash:", receipt.transactionHash);
    } catch (error) {
      console.error("An error occurred during deployment:", error);
    }
  }
