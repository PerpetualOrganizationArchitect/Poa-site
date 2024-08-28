import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { ElectionCreated } from "../../generated/templates/ElectionContract/ElectionContract"

import { Election, PerpetualOrganization } from "../../generated/schema"


export function handleElectionCreated(event: ElectionCreated): void {
    log.info("Triggered handleElectionCreated", []);

    let entity = new Election(event.params.electionId.toHex());

    entity.proposalId = event.params.proposalId;
    entity.isActive = true;
    entity.electionContract = event.address.toHex();
    
    entity.save();

}