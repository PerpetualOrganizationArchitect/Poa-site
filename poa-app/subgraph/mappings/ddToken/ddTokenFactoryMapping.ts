import {log } from "@graphprotocol/graph-ts";
import { TokenCreated } from "../../generated/DirectDemocracyTokenFactory/DirectDemocracyTokenFactory";
import { DDTokenCreated, DDToken, DDAllowedRoleName, PerpetualOrganization } from "../../generated/schema";
import {DirectDemocracyToken as tokenTemplate} from "../../generated/templates";

export function handleTokenCreated(event: TokenCreated): void {
  log.info("Triggered handleTokenCreated", []);

  let entity = new DDTokenCreated(event.params.tokenAddress.toHex());

  entity.tokenAddress = event.params.tokenAddress;
  entity.name = event.params.name;
  entity.symbol = event.params.symbol;
  entity.POname = event.params.POname;
  entity.save();

  let allowedRoleNames = event.params.allowedRoleNames;

  
  let newToken = new DDToken(event.params.tokenAddress.toHex());
  newToken.tokenAddress = event.params.tokenAddress;
  newToken.name = event.params.name;
  newToken.symbol = event.params.symbol;
  newToken.POname = event.params.POname;
  newToken.save();

  let po = PerpetualOrganization.load(event.params.POname);
  if (po != null) {
    po.DirectDemocracyToken = event.params.tokenAddress.toHex();
    po.save();
  }

  
  for (let i = 0; i < allowedRoleNames.length; i++) {
    let allowedRole = new DDAllowedRoleName(event.params.tokenAddress.toHex() + "-" + allowedRoleNames[i]);
    allowedRole.roleName = allowedRoleNames[i];
    allowedRole.tokenCreated = entity.id;
    allowedRole.save();
  }


  tokenTemplate.create(event.params.tokenAddress);
}

