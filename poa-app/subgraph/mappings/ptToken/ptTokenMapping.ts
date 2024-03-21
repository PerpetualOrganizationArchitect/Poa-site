import { log } from "@graphprotocol/graph-ts"
import { Mint as MintEvent, TaskManagerAddressSet } from "../../generated/templates/ParticipationToken/ParticipationToken"
import { PTTokenMintEvent, PTToken, User } from "../../generated/schema"

export function handleTokenMint(event: MintEvent): void {
  log.info("Triggered handleTokenMint", [])

  let entity = new PTTokenMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.token = event.address.toHex()
  entity.amount = event.params.amount
  entity.save()

  let token = PTToken.load(event.address.toHex())
  if (token == null) {
    //return if token not found
    log.error("PTToken not found: {}", [event.address.toHex()])
    return
  }

  let user = User.load(token.POname+'-'+event.params.to.toHex())
  if (user != null) {
    user.ptTokenBalance = user.ptTokenBalance.plus(event.params.amount)
    user.save()
  }
}

export function handleTaskManagerAddressSet(event: TaskManagerAddressSet): void {

    let token = PTToken.load(event.address.toHex());
    if (token != null) {
      token.taskManagerAddress = event.params.taskManagerAddress;
      token.save();
    }
    

}