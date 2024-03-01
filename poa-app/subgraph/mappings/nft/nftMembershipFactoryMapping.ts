import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { ContractCreated } from "../../generated/NFTMembershipFactory/NFTMembershipFactory";
import { NFTMembershipCreated, NFTMembership, NFTMemberType, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { NFTMembership as membershipTemplate } from "../../generated/templates";

export function handleContractCreated(event: ContractCreated): void {
  log.info("Triggered handleMembershipContractCreated", []);

  let entity = new NFTMembershipCreated(event.params.contractAddress.toHex());

  entity.contractAddress = event.params.contractAddress;
  entity.memberTypeNames = event.params.memberTypeNames;
  entity.executiveRoles = event.params.executiveRoleNames;
  entity.defaultImageURL = event.params.defaultImageURL;
  entity.POname = event.params.POname;
  entity.save();

  let newMembership = new NFTMembership(event.params.contractAddress.toHex());
  newMembership.contractAddress = event.params.contractAddress;
  newMembership.POname = event.params.POname;
  newMembership.memberTypeNames = event.params.memberTypeNames;
  newMembership.executiveRoles = event.params.executiveRoleNames;
  newMembership.defaultImageURL = event.params.defaultImageURL;
  newMembership.save();

  let po = new PerpetualOrganization(event.params.POname); 
  if( po != null) {
    po.name = event.params.POname;
    po.NFTMembership = newMembership.id;
    po.save();
  }


  for (let i = 0; i < event.params.memberTypeNames.length; i++) {
    let memberType = new NFTMemberType(event.params.contractAddress.toHex() + "-" + event.params.memberTypeNames[i]);
    memberType.memberTypeName = event.params.memberTypeNames[i];
    memberType.imageURL = entity.defaultImageURL; 
    memberType.membership = newMembership.id;
    memberType.save();
  }

  membershipTemplate.create(event.params.contractAddress);
}
