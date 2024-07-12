import { log } from "@graphprotocol/graph-ts"
import {VotingContractSet, TokensReceived, ToeknsSent  } from "../../generated/templates/Treasury/Treasury"
import { Treasury} from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";

export function handleVotingSet(event: VotingContractSet): void{
    log.info("Triggered handleVotingContractSet", [])
    
    let treasury = Treasury.load(event.address.toHex());
    if (treasury != null) {
      treasury.votingContract = event.params.votingContract;
      treasury.save();
    }
}

export function handleSendTokens(event: TokensSent): void{
    log.info("Triggered handleSendTokens", [])
    
    let treasury = Treasury.load(event.address.toHex());
    if (treasury != null) {
      treasury.totalTokensSent = treasury.totalTokensSent.plus(event.params.amount);
      treasury.save();
    }
}

