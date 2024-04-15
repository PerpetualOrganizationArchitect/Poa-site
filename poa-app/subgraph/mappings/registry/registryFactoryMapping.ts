import { Address, dataSource, log } from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import { RegistryCreated, Registry, ValidContract, PerpetualOrganization} from "../../generated/schema";
import {DataSourceContext} from "@graphprotocol/graph-ts";

export function handleRegistryContractCreated(event: RegistryContractCreatedEvent): void {
    log.info("Triggered handleRegistryContractCreated", []);

    let entity = new RegistryCreated(event.params.newRegistryAddress.toHex());

    entity.contractAddress = event.params.newRegistryAddress;
    entity.POname = event.params.POname;
    
    entity.save();

    let newRegistry = new Registry(event.params.newRegistryAddress.toHex());
    newRegistry.contract = event.params.newRegistryAddress.toHex();
    newRegistry.POname = event.params.POname;
    newRegistry.logoURL = event.params.logoURL;
    newRegistry.votingContract = event.params.VotingControlAddress;
    newRegistry.save();

    let po = PerpetualOrganization.load(newRegistry.POname);
    if (po != null) {
      po.registry = newRegistry.id;
      po.description= description 
      po.logoURL = logurl 
      po.constitution = constitution
      
      
      po.save();
    }
    
    //loop through all contractNames and ConttractAddresses and add them to the registry as validContracts
    let contractNames = event.params.contractNames;
    let contractAddresses = event.params.contractAddresses;

    for (let i = 0; i < contractNames.length; i++) {
        let validContract = new ValidContract(contractNames[i]);
        validContract.registry = newRegistry.id;
        validContract.name = contractNames[i];
        validContract.contractAddress = contractAddresses[i];
        validContract.registry = newRegistry.id;
        validContract.save();
    }

  }