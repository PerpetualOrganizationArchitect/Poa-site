import { log} from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { ElectionCreated, CandidateAdded, ElectionConcluded } from "../../generated/templates/ElectionContract/ElectionContract"

import { Election, Candidate } from "../../generated/schema"


export function handleElectionCreated(event: ElectionCreated): void {
    log.info("Triggered handleElectionCreated", []);

    let entity = new Election(event.params.electionId.toHex());

    entity.proposalId = event.params.proposalId;
    entity.isActive = true;
    entity.electionContract = event.address.toHex();
    
    entity.save();

}

export function handleCandidateAdded(event: CandidateAdded ): void {

    let entity = new Candidate(event.params.electionId.toHex()+"-"+ event.params.candidateIndex.toHex());
    entity.election = event.params.electionId.toHex();
    entity.candidateAddress = event.params.candidateAddress;
    entity.candidateName = event.params.candidateName;
    entity.isWinner = false;
    entity.save();

}

export function handleElectionConcluded(event:ElectionConcluded ): void {

    let entity = Election.load(event.params.electionId.toHex());

    if(entity != null){
        entity.hasValidWinner = event.params.hasValidWinner;
        entity.winningCandidateIndex = event.params.winningCandidateIndex;
        entity.save();
    }
    
    let winner = Candidate.load(event.params.electionId.toHex()+"-"+event.params.winningCandidateIndex.toHex())

    if(winner != null){
        winner.isWinner= event.params.hasValidWinner;
        winner.save();
    }

}