import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { ElectionContractCreated } from "../../generated/ElectionContractFactory/ElectionContractFactory";
import { ElectionContract, PerpetualOrganization } from "../../generated/schema";
import {ElectionContract as electionTemplate} from "../../generated/templates";


export function handleElectionContractCreated(event: ElectionContractCreated): void {

    let entity = new ElectionContract(event.params.electionContractAddress.toHex());
  
    entity.contractAddress = event.params.electionContractAddress;
    entity.POname = event.params.POname;
    entity.votingContractAddress = event.params.votingContractAddress
    entity.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
      po.ElectionContract = event.params.electionContractAddress.toHex();
      po.save();
    }
  
    electionTemplate.create(event.params.electionContractAddress);
  }
