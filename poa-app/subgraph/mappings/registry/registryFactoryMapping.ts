import { Address, dataSource, json, log, ipfs, Bytes, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import { infoIPFS, aboutLink, RegistryCreated, Registry, ValidContract, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { JSONValueKind } from "@graphprotocol/graph-ts";

let POHASH_KEY = "POHASH";
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
    newRegistry.logoHash = event.params.logoURL;
    newRegistry.votingContract = event.params.VotingControlAddress;
    newRegistry.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
        po.registry = newRegistry.id;
        po.logoHash = event.params.logoURL;
    

        let context = new DataSourceContext();
        log.info("Setting context for PO: {}", [event.params.POname]);
        context.setString(POHASH_KEY, event.params.POinfoHash);
        context.setString(PONAME_KEY, event.params.POname);

        log.info("Creating infoIPFS template with hash: {}", [event.params.POinfoHash]);
        DataSourceTemplate.createWithContext("infoIpfs", [event.params.POinfoHash], context);
        po.aboutInfo = event.params.POinfoHash;
        po.save();
       
    }

    let contractNames = event.params.contractNames;
    let contractAddresses = event.params.contractAddresses;

    if (contractNames.length != contractAddresses.length) {
        log.warning("Contract names and addresses arrays length mismatch", []);
        return;
    }

    for (let i = 0; i < contractNames.length; i++) {
        let validContract = new ValidContract(contractNames[i]);
        validContract.registry = newRegistry.id;
        validContract.name = contractNames[i];
        validContract.contractAddress = contractAddresses[i];
        validContract.save();
    }
}

export function handleIpfsContent(aboutInfo: Bytes): void {
    log.info("Triggered handleIpfsContent", []);
  
    let ctx = dataSource.context();
    let poHash = ctx.getString(POHASH_KEY).toString();
    log.info("PO hash is", [poHash]);
    if (poHash === null) {
        log.warning("PO hash is null", []);
        return;
    }
    

    let poName = ctx.getString(PONAME_KEY).toString();
    log.info("PO name is", [poName]);
    if (poName === null) {
        log.warning("PO name is null", []);
        return;
    }

    let ipfsContent = json.fromBytes(aboutInfo).toObject();
    if (ipfsContent == null) {
        log.warning("IPFS content is null", []);
        return;
    }

    let descriptionValue = ipfsContent.get("description");

    if (descriptionValue === null) {
        log.warning("Description is null", []);
        return;
    }

    let description = descriptionValue.toString();


   let ipfsEntity = infoIPFS.load(poHash);
    if (ipfsEntity == null) {
        ipfsEntity = new infoIPFS(poHash);
    }

    ipfsEntity.description = description;

    let linksValue = ipfsContent.get("links");

    if (linksValue !== null && linksValue.kind === JSONValueKind.ARRAY) {
        let linksArray = linksValue.toArray();
        for (let i = 0; i < linksArray.length; i++) {
            let link = linksArray[i].toObject();
            let linkNameValue = link.get("name");
            if (linkNameValue === null) continue;  
            let linkName = linkNameValue.toString();
            let linkUrlValue = link.get("url");
            if (linkUrlValue === null) continue;  
            let linkUrl = linkUrlValue.toString();
            
            let linkId = poHash + "-" + linkName;
            let linkEntity = new aboutLink(linkId);
            linkEntity.name = linkName;
            linkEntity.url = linkUrl;
            linkEntity.infoIPFS = ipfsEntity.id;
            linkEntity.save();
        }
    }
   

    ipfsEntity.save();

    let po = PerpetualOrganization.load(poName);
    if (po != null) {
        log.warning("PO about info is", [poName]);
        po.aboutInfo = ipfsEntity.id;
        po.save();
    }
    else {
        log.warning("PO is null", [poName]);
    }

}