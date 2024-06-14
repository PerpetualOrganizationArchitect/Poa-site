import { Address, dataSource, json, log, ipfs, Bytes, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { RegistryCreated as RegistryContractCreatedEvent } from "../../generated/RegistryFactory/RegistryFactory";
import { infoIPFS, aboutLink, RegistryCreated, Registry, ValidContract, PerpetualOrganization } from "../../generated/schema";
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { JSONValueKind } from "@graphprotocol/graph-ts";

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

        let context = new DataSourceContext();
        context.setString(PONAME_KEY, event.params.POname);

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

    // Fetch context and check for null
    let ctx = dataSource.context();
    let poHash = ctx.getString(PONAME_KEY);
    if (poHash === null) {
        log.error("POHASH_KEY is missing in context", []);
        return;
    }
    let poHashString = poHash.toString();

    // Ensure aboutInfo is not empty
    if (aboutInfo.length === 0) {
        log.error("aboutInfo is empty", []);
        return;
    }

    // Safe parsing of JSON
    let ipfsContent = json.try_fromBytes(aboutInfo).value;
    if (ipfsContent === null) {
        log.error("Failed to parse IPFS content as JSON", []);
        return;
    }

    let descriptionValue = ipfsContent.toObject().get("description");
    if (descriptionValue === null) {
        log.warning("Description is null", []);
        return;
    }
    let description = descriptionValue.toString();
    let ipfsEntity = new infoIPFS(poHashString);
    ipfsEntity.description = description;

    // Save the ipfsEntity early to reference it in link entities
    ipfsEntity.save();

    let linksValue = ipfsContent.toObject().get("links");
    if (linksValue !== null && linksValue.kind === JSONValueKind.ARRAY) {
        let linksArray = linksValue.toArray();
        for (let i = 0; i < linksArray.length; i++) {
            let link = linksArray[i].toObject();
            if (link === null) {
                log.error("Link element is not an object", []);
                continue;
            }
            let linkNameValue = link.get("name");
            if (linkNameValue === null) {
                continue;  // Skip this link if the name is null
            }
            let linkName = linkNameValue.toString();
            let linkUrlValue = link.get("url");
            if (linkUrlValue === null) {
                continue;  // Skip this link if the url is null
            }
            let linkUrl = linkUrlValue.toString();

            let linkId = poHashString + "-" + linkName;
            let linkEntity = new aboutLink(linkId);
            linkEntity.name = linkName;
            linkEntity.url = linkUrl;
            linkEntity.infoIPFS = ipfsEntity.id;
            linkEntity.save();
        }
    }

    // Load PerpetualOrganization to update aboutInfo
    let po = PerpetualOrganization.load(poHashString);
    if (po != null) {
        po.aboutInfo = ipfsEntity.id;
        po.save();
    } else {
        log.error("PerpetualOrganization not found for given poHash", [poHashString]);
    }
}
