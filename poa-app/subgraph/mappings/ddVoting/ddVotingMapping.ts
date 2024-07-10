import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { NewProposal, Voted, PollOptionNames, WinnerAnnounced } from "../../generated/templates/DirectDemocracyVoting/DirectDemocracyVoting"
import { DDProposal, DDPollOption,DDVote, DDVoting, User } from "../../generated/schema"

export function handlePollCreated(event: NewProposal): void {
  log.info("Triggered handleNewProposal", []);

    let newProposal = new DDProposal(event.params.proposalId.toHex()+"-"+event.address.toHex());
    newProposal.name = event.params.name;
    newProposal.description = event.params.description;
    newProposal.creationTimestamp = event.params.creationTimestamp;
    newProposal.timeInMinutes = event.params.timeInMinutes;
    newProposal.transferTriggerOptionIndex = event.params.transferTriggerOptionIndex;
    newProposal.transferAmount = event.params.transferAmount;
    newProposal.transferRecipient = event.params.transferRecipient;
    newProposal.transferEnabled = event.params.transferEnabled;
    newProposal.experationTimestamp = event.params.creationTimestamp.plus(event.params.timeInMinutes.times(BigInt.fromI32(60)));

    newProposal.totalVotes = BigInt.fromI32(0);
    newProposal.voting = event.address.toHex();
    newProposal.validWinner = false;
    newProposal.save();
  
}


export function handleVoted(event: Voted): void {
    log.info("Triggered handleVoted for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toHex()+"-"+event.address.toHex()
    let proposal = DDProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }
  
    let voteId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let vote = new DDVote(voteId);
    vote.proposal = proposalId;

    let contract = DDVoting.load(event.address.toHex());

    if (!contract) {
      log.error("Voting contract not found: {}", [event.address.toHex()]);
      return;
    }

    vote.voter = contract.POname+'-' + event.params.voter.toHex();
    vote.optionIndex = event.params.optionIndex;
    vote.voteWeight = BigInt.fromI32(100);
    vote.save();

    let user = User.load(contract.POname+'-' + event.params.voter.toHex());
    if (user != null) {
      user.totalVotes = user.totalVotes.plus(BigInt.fromI32(1));
      user.save();
    }
  
    proposal.totalVotes = proposal.totalVotes.plus(BigInt.fromI32(100));
    proposal.save();

    //update option votes
    let optionId = proposalId + "-" + event.params.optionIndex.toString();
    let option = DDPollOption.load(optionId);
    if (!option) {
      log.error("Option not found: {}", [optionId]);
      return;
    }
    option.votes = option.votes.plus(BigInt.fromI32(100));
    option.save();

  }
  
  export function handlePollOptionNames(event: PollOptionNames): void {
    log.info("Triggered handlePollOptionNames for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toHex()+"-"+event.address.toHex();
    let optionId = proposalId + "-" + event.params.optionIndex.toString();
    let option = new DDPollOption(optionId);
    option.proposal = proposalId;
    option.name = event.params.name;
    option.votes = BigInt.fromI32(0);
    option.save();
  }
  
  export function handleWinnerAnnounced(event: WinnerAnnounced): void {
    log.info("Triggered handleWinnerAnnounced for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toHex()+"-"+event.address.toHex();
    let proposal = DDProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }
  
    proposal.winningOptionIndex = event.params.winningOptionIndex;
    proposal.validWinner = event.params.hasValidWinner;
    proposal.save();
  }
  