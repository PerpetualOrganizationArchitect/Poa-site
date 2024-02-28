import { log } from "@graphprotocol/graph-ts"
import { Mint as MintEvent, TaskManagerAddressSet } from "../../generated/templates/ParticipationToken/ParticipationToken"
import { PTTokenMintEvent, PTToken } from "../../generated/schema"

export function handleTokenMint(event: MintEvent): void {
  log.info("Triggered handleTokenMint", [])

  let entity = new PTTokenMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.token = event.address.toHex()
  entity.amount = event.params.amount
  entity.save()
}
// still needs testing
export function handleTaskManagerSet(event: TaskManagerAddressSet): void {

    let token = PTToken.load(event.address.toHex());
    token.taskManagerAddress = event.params.taskManagerAddress;

    token.save();

}