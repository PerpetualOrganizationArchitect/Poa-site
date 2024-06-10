import { Address, dataSource, json, log, ipfs, Bytes, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import { infoIPFS, aboutLink, RegistryCreated, Registry, ValidContract, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { JSONValueKind } from "@graphprotocol/graph-ts";

let POHASH_KEY = "POHASH";

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

        let context = new DataSourceContext();
        context.setString(POHASH_KEY, event.params.POinfoHash);

        log.info("Creating infoIPFS template with hash: {}", [event.params.POinfoHash]);
        DataSourceTemplate.createWithContext("infoIpfs", [event.params.POinfoHash], context);
        po.aboutInfo = event.params.POinfoHash;  // Updated to use hash as ID
        po.logoHash = event.params.logoURL;
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

    let ipfsContent = json.fromBytes(aboutInfo).toObject();
    if (ipfsContent == null) {
        log.info("IPFS content is null", []);
        return;
    }

    let descriptionValue = ipfsContent.get("description");
    let linksValue = ipfsContent.get("links");
    if (descriptionValue === null) {
        log.warning("Description is null", []);
        return;
    }

    let description = descriptionValue.toString();
    let ipfsEntity = new infoIPFS(poHash);
    ipfsEntity.description = description;

    ipfsEntity.save();

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

    let po = PerpetualOrganization.load(poHash);
    if (po != null) {
        po.aboutInfo = ipfsEntity.id;
        po.save();
    }
}
