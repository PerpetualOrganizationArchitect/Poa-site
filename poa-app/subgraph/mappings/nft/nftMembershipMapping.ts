import { log } from "@graphprotocol/graph-ts"
import { mintedNFT as MintEvent, membershipTypeChanged } from "../../generated/templates/NFTMembership/NFTMembership"
import {NFTMintEvent,NFTChangeTypeEvent } from "../../generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'


export function handleMintedNFT(event: MintEvent): void {
  log.info("Triggered handleMintedNFT", []);
  let entity = new NFTMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.membership = event.params.memberTypeName;
  entity.recipient = event.params.recipient;
  entity.tokenURI = event.params.tokenURI;
  entity.save();
}

export function handleMembershipTypeChanged(event: membershipTypeChanged): void {
  log.info("Triggered handleMembershipTypeChanged", []);
  let entity = new NFTChangeTypeEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.membership = event.params.newMemberType;
  entity.user = event.params.user;
  entity.save();
}

