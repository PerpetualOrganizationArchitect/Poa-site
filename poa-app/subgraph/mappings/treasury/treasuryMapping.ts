import { log } from "@graphprotocol/graph-ts"
import {VotingContractSet, TokensReceived  } from "../../generated/templates/Treasury/Treasury"
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

// export function handleTokensReceived(event: TokensReceived): void{
//     log.info("Triggered handleTokensReceived", [])
    
//     let treasury = Treasury.load(event.address.toHex());
//     if (treasury != null) {
//       treasury.tokensReceived = event.params.tokensReceived;
//       treasury.save();
//     }
// }