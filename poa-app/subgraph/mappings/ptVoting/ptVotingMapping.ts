import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { NewProposal, Voted, PollOptionNames, WinnerAnnounced } from "../../generated/templates/ParticipationVoting/ParticipationVoting"
import { PTProposal, PTPollOption,PTVote , PTVoting, User, PTVoteWeight} from "../../generated/schema"

export function handleNewProposal(event: NewProposal): void {
  log.info("Triggered handleNewProposal", []);

    let newProposal = new PTProposal(event.params.proposalId.toString()+'-'+event.address.toHex());
    newProposal.name = event.params.name;
    let contract = PTVoting.load(event.address.toHex());
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
    newProposal.totalVotes = BigInt.fromI32(0);
    newProposal.voting = event.address.toHex();
    newProposal.transferAddress = event.params.transferToken;
    newProposal.validWinner = false;
    newProposal.save();
}


export function handleVoted(event: Voted): void {
    log.info("Triggered handleVoted for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toString()+'-'+event.address.toHex();
    let proposal = PTProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }
  
    let voteId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let vote = new PTVote(voteId);
    vote.proposal = proposalId;
    let contract = PTVoting.load(event.address.toHex());

    if (!contract) {
      log.error("Voting contract not found: {}", [event.address.toHex()]);
      return;
    }
    
    vote.voter = contract.POname+'-' + event.params.voter.toHex();
    let user = User.load(contract.POname+'-' + event.params.voter.toHex());
    if (user != null) {
      user.totalVotes = user.totalVotes.plus(BigInt.fromI32(1));
      user.save();
    }
    vote.save();
  
    proposal.totalVotes = proposal.totalVotes.plus(BigInt.fromI32(1));
    proposal.save();

    for (let i = 0; i < event.params.optionIndices.length; i++) {
      let optionIndex = event.params.optionIndices[i];
      let weight = event.params.weights[i];

      let voteWeightId = voteId + "-" + optionIndex.toString();
      let voteWeight = new PTVoteWeight(voteWeightId);
      voteWeight.vote = voteId;
      voteWeight.user = contract.POname+'-' + event.params.voter.toHex();
      voteWeight.optionIndex = optionIndex;
      voteWeight.voteWeight = weight.times(event.params.totalVoteWeight);

      voteWeight.save();

      // Update option vote tally
      let optionId = proposalId + "-" + optionIndex.toString();
      let option = PTPollOption.load(optionId);
      if (!option) {
          log.error("Option not found: {}", [optionId]);
          return;
      }

      option.votes = option.votes.plus(weight.times(event.params.totalVoteWeight));
      option.save();
    }
  }
  
  export function handlePollOptionNames(event: PollOptionNames): void {
    log.info("Triggered handlePollOptionNames for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toString()+'-'+event.address.toHex();
    let optionId = proposalId + "-" + event.params.optionIndex.toString();
    let option = new PTPollOption(optionId);
    option.proposal = proposalId;
    option.name = event.params.name;
    option.votes = BigInt.fromI32(0);
    option.save();
  }
  
  export function handleWinnerAnnounced(event: WinnerAnnounced): void {
    log.info("Triggered handleWinnerAnnounced for proposalId {}", [event.params.proposalId.toString()]);
  
    let proposalId = event.params.proposalId.toString()+'-'+event.address.toHex();
    let proposal = PTProposal.load(proposalId);
    if (!proposal) {
      log.error("Proposal not found: {}", [proposalId]);
      return;
    }
  
    proposal.winningOptionIndex = event.params.winningOptionIndex;
    proposal.validWinner = event.params.hasValidWinner;
    proposal.save();
  }
  