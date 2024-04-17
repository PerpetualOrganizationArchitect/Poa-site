import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { VotingContractCreated } from "../../generated/DirectDemocracyVotingFactory/DirectDemocracyVotingFactory";
import { DDVotingCreated, DDVoting, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {DirectDemocracyVoting as votingTemplate} from "../../generated/templates";


export function handleVotingContractCreated(event: VotingContractCreated): void {
    log.info("Triggered handleVotingContractCreated", []);
  
    let entity = new DDVotingCreated(event.params.votingAddress.toHex());
  
    entity.contractAddress = event.params.votingAddress;
    entity.POname = event.params.POname;
    entity.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
      po.DirectDemocracyVoting = event.params.votingAddress.toHex();
      po.save();
    }
  
    let newVoting = new DDVoting(event.params.votingAddress.toHex());
    newVoting.contract = event.params.votingAddress.toHex();
    newVoting.POname = event.params.POname;
    newVoting.quorum = event.params.quorumPercentage;
    newVoting.save();
  
    votingTemplate.create(event.params.votingAddress);
  }