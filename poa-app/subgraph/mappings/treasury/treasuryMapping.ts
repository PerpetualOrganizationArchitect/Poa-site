import { log } from "@graphprotocol/graph-ts"
import {VotingContractSet, TokensReceived, TokensSent  } from "../../generated/templates/Treasury/Treasury"
import { Treasury, TreasuryWithdrawal, TreasuryDeposit} from "../../generated/schema";
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

    let entity = new TreasuryWithdrawal(event.transaction.hash.toHex());

    entity.amount = event.params.amount;
    entity.token = event.params.token;
    entity.recipient = event.params.to;
    entity.treasury = event.address.toHex();
    entity.save();

}

export function handleReceiveTokens(event: TokensReceived): void{
    log.info("Triggered handleReceiveTokens", [])

    let entity = new TreasuryDeposit(event.transaction.hash.toHex());

    entity.amount = event.params.amount;
    entity.token = event.params.token;
    entity.sender = event.params.from;
    entity.treasury = event.address.toHex();
    entity.save();

}

