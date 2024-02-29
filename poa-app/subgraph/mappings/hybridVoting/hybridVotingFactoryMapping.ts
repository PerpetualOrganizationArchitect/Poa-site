import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { HybridVotingContractCreated } from "../../generated/HybridVotingFactory/HybridVotingFactory";
import { HybridVotingCreated, HybridVoting } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {HybridVoting as votingTemplate} from "../../generated/templates";

export function handleVotingContractCreated(event: HybridVotingContractCreated): void {
    log.info("Triggered handleVotingContractCreated", []);
  
    let entity = new HybridVotingCreated(event.params.hybridVotingAddress.toHex());
  
    entity.contractAddress = event.params.hybridVotingAddress;
    entity.POname = event.params.POname;
    entity.save();
  
    let newVoting = new HybridVoting(event.params.hybridVotingAddress.toHex());
    newVoting.contract = event.params.hybridVotingAddress.toHex();
    newVoting.POname = event.params.POname;
    newVoting.save();
  
    votingTemplate.create(event.params.hybridVotingAddress);
  }