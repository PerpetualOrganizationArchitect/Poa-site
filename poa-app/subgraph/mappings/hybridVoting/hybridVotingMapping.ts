import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { NewProposal, Voted, PollOptionNames, WinnerAnnounced } from "../../generated/templates/HybridVoting/HybridVoting"
import { HybridProposal, HybridPollOption,HybridVote, HybridVoting, User } from "../../generated/schema"


export function handleNewProposal(event: NewProposal): void {
  log.info("Triggered handleNewProposal", []);

    let newProposal = new HybridProposal(event.params.proposalId.toString()+'-'+event.address.toHex());
    newProposal.name = event.params.name;
    let contract = HybridVoting.load(event.address.toHex());
    if (!contract) {
      log.error("Voting contract not found: {}", [event.address.toHex()]);
      return;
    }
    newProposal.creator = contract.POname + '-' + event.transaction.from.toHex();
    newProposal.description = event.params.description;
    newProposal.creationTimestamp = event.params.creationTimestamp;
    newProposal.timeInMinutes = event.params.timeInMinutes;
    newProposal.transferTriggerOptionIndex = event.params.transferTriggerOptionIndex;
    newProposal.transferAmount = event.params.transferAmount;
    newProposal.transferRecipient = event.params.transferRecipient;
    newProposal.transferEnabled = event.params.transferEnabled;
    newProposal.experationTimestamp = event.params.creationTimestamp.plus(event.params.timeInMinutes.times(BigInt.fromI32(60)));
    newProposal.totalVotesDD = BigInt.fromI32(0);
    newProposal.totalVotesPT = BigInt.fromI32(0);
    newProposal.voting = event.address.toHex();
    newProposal.transferAddress = event.params.transferToken;
    newProposal.validWinner = false;
    newProposal.save();
}

// needs work
export function handleVoted(event: Voted): void {
    log.info("Triggered handleVoted for proposalId {}", [event.params.proposalId.toString()]);

    let proposalId = event.params.proposalId.toString() + '-' + event.address.toHex();
    let proposal = HybridProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }

    let voteId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let vote = new HybridVote(voteId);
    vote.proposal = proposalId;
    let contract = HybridVoting.load(event.address.toHex());
    
    if (!contract) {
      log.error("Voting contract not found: {}", [event.address.toHex()]);
      return;
    }

    vote.voter = contract.POname + '-' + event.params.voter.toHex();
    vote.optionIndex = event.params.optionIndex;



    let votePT = event.params.voteWeightPT;
    let voteDD = event.params.voteWeightDDT;

    let scalingFactor = BigInt.fromI32(1000000000);

    let normalizedVotePT = proposal.totalVotesPT.isZero() ? BigInt.fromI32(0) : votePT.times(scalingFactor).div(proposal.totalVotesPT);
    let normalizedVoteDD = proposal.totalVotesDD.isZero() ? BigInt.fromI32(0) : voteDD.times(scalingFactor).div(proposal.totalVotesDD);

    let weightedVotePT = normalizedVotePT.times((contract.percentPT)).div(scalingFactor); 
    let weightedVoteDD = normalizedVoteDD.times((contract.percentDD)).div(scalingFactor); 

    vote.voteWeightPT = weightedVotePT;
    vote.voteWeightDD = weightedVoteDD;
    proposal.totalVotesPT = proposal.totalVotesPT.plus(weightedVotePT);
    proposal.totalVotesDD = proposal.totalVotesDD.plus(weightedVoteDD);
    vote.save();

    let user = User.load(contract.POname + '-' + event.params.voter.toHex());
    if (user != null) {
      user.totalVotes = user.totalVotes.plus(BigInt.fromI32(1));
      user.save();
    }

    // Update option votes
    let optionId = proposalId + "-" + event.params.optionIndex.toString();
    let option = HybridPollOption.load(optionId);
    if (!option) {
      log.error("Option not found: {}", [optionId]);
      return;
    }
    option.votes = option.votes.plus(weightedVotePT.plus(weightedVoteDD));
    option.save();
  }

  
  export function handlePollOptionNames(event: PollOptionNames): void {
    log.info("Triggered handlePollOptionNames for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toString()+'-'+event.address.toHex();
    let optionId = proposalId + "-" + event.params.optionIndex.toString();
    let option = new HybridPollOption(optionId);
    option.proposal = proposalId;
    option.name = event.params.name;
    option.votes = BigInt.fromI32(0);
    option.save();
  }
  
  export function handleWinnerAnnounced(event: WinnerAnnounced): void {
    log.info("Triggered handleWinnerAnnounced for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toString()+'-'+event.address.toHex();
    let proposal = HybridProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }
  
    proposal.winningOptionIndex = event.params.winningOptionIndex;
    proposal.validWinner = event.params.hasValidWinner;
    proposal.save();
  }
  