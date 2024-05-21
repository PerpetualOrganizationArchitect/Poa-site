import { Address, dataSource, json, log, ipfs, Bytes, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import { infoIPFS, aboutLinks, RegistryCreated, Registry, ValidContract, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";

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
    }

    // Loop through all contractNames and contractAddresses and add them to the registry as validContracts
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
    let poName = ctx.getString(PONAME_KEY);

    let ipfsContentString = content.toString();
    let ipfsContent = json.fromBytes(content).toObject();

    if (ipfsContent == null) {
        log.warning("IPFS content is null", []);
        return;
    }

    let descriptionValue = ipfsContent.get("description");
    let linksValue = ipfsContent.get("links");

    if (descriptionValue == null) {
        log.warning("Description is null", []);
        return;
    }

    let description = descriptionValue.toString();
    let linksArray = linksValue != null ? linksValue.toArray() : [];

    let ipfsEntity = new infoIPFS(poName);
    ipfsEntity.description = description;

    let linkEntities: Array<string> = [];
    for (let i = 0; i < linksArray.length; i++) {
        let linkObject = linksArray[i].toObject();
        let linkNameValue = linkObject.get("name");
        let linkUrlValue = linkObject.get("url");

        if (linkNameValue == null || linkUrlValue == null) {
            log.warning("Link name or URL is null for index {}", [i.toString()]);
            continue;
        }

        let linkName = linkNameValue.toString();
        let linkUrl = linkUrlValue.toString();

        let linkEntity = new aboutLinks(poName + "-" + i.toString());
        linkEntity.name = linkName;
        linkEntity.url = linkUrl;
        linkEntity.infoIPFS = ipfsEntity.id;
        linkEntity.save();

        linkEntities.push(linkEntity.id);
    }

    ipfsEntity.links = linkEntities.length > 0 ? linkEntities : null;
    ipfsEntity.save();

    let po = PerpetualOrganization.load(poName);
    if (po != null) {
        po.aboutInfo = ipfsEntity.id;
        po.save();
    }
}
