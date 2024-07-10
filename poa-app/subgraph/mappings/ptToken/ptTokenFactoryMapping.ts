import { Address, dataSource, log, BigInt } from "@graphprotocol/graph-ts";
import { TokenCreated } from "../../generated/ParticipationTokenFactory/ParticipationTokenFactory";
import { PTTokenCreated, PTToken, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {ParticipationToken as tokenTemplate} from "../../generated/templates";

export function handleTokenCreated(event: TokenCreated): void {
    log.info("Triggered handleTokenCreated", []);
  
    let entity = new PTTokenCreated(event.params.tokenAddress.toHex());
  
    entity.tokenAddress = event.params.tokenAddress;
    entity.name = event.params.name;
    entity.symbol = event.params.symbol;
    entity.POname = event.params.POname;
    entity.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
      po.ParticipationToken = event.params.tokenAddress.toHex();
      po.save();
    }
    
    let newToken = new PTToken(event.params.tokenAddress.toHex());
    newToken.tokenAddress = event.params.tokenAddress;
    newToken.name = event.params.name;
    newToken.symbol = event.params.symbol;
    newToken.POname = event.params.POname;
    newToken.supply = BigInt.fromI32(0);
    newToken.save();
  
    tokenTemplate.create(event.params.tokenAddress);
  }