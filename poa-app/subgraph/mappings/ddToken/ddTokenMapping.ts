import { log } from "@graphprotocol/graph-ts"
import { Mint as MintEvent } from "../../generated/templates/DirectDemocracyToken/DirectDemocracyToken"
import { DDTokenMintEvent, DDToken, User } from "../../generated/schema"

export function handleTokenMint(event: MintEvent): void {
  log.info("Triggered handleTokenMint", [])
  
  let entity = new DDTokenMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.token = event.address.toHex()
  entity.amount = event.params.amount
  entity.save()

  let token = DDToken.load(event.address.toHex())
  if (token == null) {
    //return if token not found
    log.error("DDToken not found: {}", [event.address.toHex()])
    return
  }

  let user = User.load(token.POname+'-'+event.params.to.toHex())
  if (user != null) {
    user.ddTokenBalance = user.ddTokenBalance.plus(event.params.amount)
    user.save()
  }
}
