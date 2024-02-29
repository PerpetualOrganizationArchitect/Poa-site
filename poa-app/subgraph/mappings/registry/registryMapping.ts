import { log } from "@graphprotocol/graph-ts"
import {ContractAdded, ContractUpgraded, VotingControlAddressSet, Initialized} from "../../generated/templates/Registry/Registry"
import {Registry, ValidContract} from "../../generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'

export function handleContractAdded(event: ContractAdded): void {
  log.info("Triggered handleContractAdded", [])

  let registry = Registry.load(dataSource.address().toHex())
  if (!registry) {
    log.error("Registry not found: {}", [dataSource.address().toHex()])
    return
  }

  let contract = new ValidContract(event.params.name)
  contract.registry = registry.id
  contract.name = event.params.name
  contract.contractAddress = event.params.contractAddress
  contract.save()
}

export function handleContractUpgraded(event: ContractUpgraded): void {
  log.info("Triggered handleContractUpgraded", [])


  let contract = ValidContract.load(event.params.name)
  if (!contract) {
    log.error("Contract not found: {}", [event.params.name])
    return
  }
  contract.contractAddress = event.params.newAddress
  contract.save()
}

export function handleVotingControlAddressSet(event: VotingControlAddressSet): void {
  log.info("Triggered handleVotingControlAddressSet", [])

  let registry = Registry.load(dataSource.address().toHex())
  if (!registry) {
    log.error("Registry not found: {}", [dataSource.address().toHex()])
    return
  }
  registry.votingContract = event.params.newAddress
  registry.save()
}

export function handleInitialized(event: Initialized): void {
  log.info("Triggered handleInitialized", [])

  let registry = Registry.load(dataSource.address().toHex())
    if (!registry) {
        log.error("Registry not found: {}", [dataSource.address().toHex()])
        return
    }
    registry.votingContract = event.params.VotingControlAddress

    //loop through all contractNames and contractAddresses and add them to the registry as validContracts

    for (let i = 0; i < event.params.contractNames.length; i++) {
        let contract = new ValidContract(event.params.contractNames[i])
        contract.registry = registry.id
        contract.name = event.params.contractNames[i]
        contract.contractAddress = event.params.contractAddresses[i]
        contract.save()
    }
    

  registry.save()
}
