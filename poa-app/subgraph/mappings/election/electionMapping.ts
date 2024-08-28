import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { ElectionCreated, CandidateAdded } from "../../generated/templates/ElectionContract/ElectionContract"

import { Election, PerpetualOrganization, Candidate } from "../../generated/schema"


export function handleElectionCreated(event: ElectionCreated): void {
    log.info("Triggered handleElectionCreated", []);

    let entity = new Election(event.params.electionId.toHex());

    entity.proposalId = event.params.proposalId;
    entity.isActive = true;
    entity.electionContract = event.address.toHex();
    
    entity.save();

}

export function handleCandidateAdded(event: CandidateAdded ): void {

    let entity = new Candidate(event.address.toHex() + "-" + event.params.candidateAddress.toHex());
    entity.election = event.params.electionId.toHex();
    entity.candidateAddress = event.params.candidateAddress;
    entity.candidateName = event.params.candidateName;
    entity.isWinner = false;
    entity.save();

}