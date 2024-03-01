import { log } from "@graphprotocol/graph-ts"
import { Mint as MintEvent } from "../../generated/templates/DirectDemocracyToken/DirectDemocracyToken"
import { DDTokenMintEvent, DDToken, User } from "../../generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'


export function handleTokenMint(event: MintEvent): void {
  log.info("Triggered handleTokenMint", [])
  
  let entity = new DDTokenMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.token = event.address.toHex()
  entity.amount = event.params.amount
  entity.save()

  let user = User.load(event.params.to.toHex())
  if (user != null) {
    user.ddTokenBalance = user.ddTokenBalance.plus(event.params.amount)
    user.save()
  }
}
