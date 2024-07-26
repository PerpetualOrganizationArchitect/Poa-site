import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { QuickJoinDeployed } from "../../generated/QuickJoinFactory/QuickJoinFactory";
import { QuickJoinContract, PerpetualOrganization} from "../../generated/schema";



export function handleQuickJoinDeployed(event: QuickJoinDeployed): void {
  log.info("Triggered handleQuickJoinDeployed", []);

  let entity = new QuickJoinContract(event.params.quickJoinAddress.toHex());

  entity.POname = event.params.POname;
  entity.save();

  let po = PerpetualOrganization.load(event.params.POname);
  if (po != null) {
    po.QuickJoinContract = event.params.quickJoinAddress.toHex();
    po.save();
  }

}