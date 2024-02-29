import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { VotingContractCreated } from "../../generated/ParticipationVotingFactory/ParticipationVotingFactory";
import { PTVotingCreated, PTVoting } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {ParticipationVoting as votingTemplate} from "../../generated/templates";

export function handleVotingContractCreated(event: VotingContractCreated): void {
    log.info("Triggered handleVotingContractCreated", []);
  
    let entity = new PTVotingCreated(event.params.votingContractAddress.toHex());
  
    entity.contractAddress = event.params.votingContractAddress;
    entity.POname = event.params.POname;
    entity.save();
  
    let newVoting = new PTVoting(event.params.votingContractAddress.toHex());
    newVoting.contract = event.params.votingContractAddress.toHex();
    newVoting.POname = event.params.POname;
    newVoting.save();
  
    votingTemplate.create(event.params.votingContractAddress);
  }