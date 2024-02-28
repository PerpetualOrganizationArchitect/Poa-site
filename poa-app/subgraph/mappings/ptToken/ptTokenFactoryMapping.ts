import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { TokenCreated } from "../../generated/ParticipationTokenFactory/ParticipationTokenFactory";
import { PTTokenCreated, PTToken } from "../../generated/schema";
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
  
    
    let newToken = new PTToken(event.params.tokenAddress.toHex());
    newToken.tokenAddress = event.params.tokenAddress;
    newToken.name = event.params.name;
    newToken.symbol = event.params.symbol;
    newToken.POname = event.params.POname;
    newToken.save();
  
  
    tokenTemplate.create(event.params.tokenAddress);
  }