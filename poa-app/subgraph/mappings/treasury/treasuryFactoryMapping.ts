import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { TreasuryCreated as TreasuryCreatedEvent } from "../../generated/TreasuryFactory/TreasuryFactory";
import { TreasuryCreated, Treasury, PerpetualOrganization} from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import {Treasury as treasuryTemplate} from "../../generated/templates";


export function handleTreasuryCreated(event: TreasuryCreatedEvent): void{
    log.info("Triggered handleTreasuryCreated", [])
    
    let entity = new TreasuryCreated(event.params.treasuryAddress.toHex());
    
    entity.treasuryAddress = event.params.treasuryAddress;
    entity.POname = event.params.POname;
    entity.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
      po.Treasury = event.params.treasuryAddress.toHex();
      po.save();
    }
    
    let newTreasury = new Treasury(event.params.treasuryAddress.toHex());
    newTreasury.treasuryAddress = event.params.treasuryAddress;
    newTreasury.POname = event.params.POname;
    newTreasury.save();
    
    treasuryTemplate.create(event.params.treasuryAddress);
}