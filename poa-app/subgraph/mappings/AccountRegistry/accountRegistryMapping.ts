import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  AccountManager,
  UserRegistered,
  UsernameChanged
} from "../../generated/UniversalAccountRegistry/AccountManager"
import { Account } from "../../generated/schema"

export function handleUserRegistered(event: UserRegistered): void {
  log.info("Triggered UserRegistered: {}", [event.params.username])
  let account = new Account(event.params.accountAddress.toHex())
  account.address = event.params.accountAddress
  account.userName = event.params.username
  account.save()
}

export function handleUsernameChanged(event: UsernameChanged): void {
  let id = event.params.accountAddress.toHex()
  let account = Account.load(id)
  
  if (account == null) {
    account = new Account(id)
    account.address = event.params.accountAddress
  }

  account.userName = event.params.newUsername
  account.save()
}
