import { Address, dataSource,json, log, ipfs , Bytes, DataSourceTemplate} from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import {IPFSContent, RegistryCreated, Registry, ValidContract, PerpetualOrganization} from "../../generated/schema";
import {DataSourceContext} from "@graphprotocol/graph-ts";

let PONAME_KEY = "PONAME";

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


      let context = new DataSourceContext();
      context.setString(PONAME_KEY, event.params.POname);

      context.setBytes("hash", Bytes.fromUTF8(event.params.POinfoHash));
        
      DataSourceTemplate.createWithContext("IpfsContent", [event.params.POinfoHash], context);

      po.content = event.params.POname;

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

  export function handleIpfsContent(content: Bytes): void {
    let ctx = dataSource.context();
    let poName = ctx.getString(PONAME_KEY).toString();

    let ipfsContent = content.toString();

    let i = new IPFSContent(poName);
    i.data = ipfsContent;
    i.save();

    let po = PerpetualOrganization.load(poName);
    if (po != null) {
      po.description = ipfsContent;
      po.save();
    }
}