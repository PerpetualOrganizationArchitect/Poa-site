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
        context.setBytes("hash", Bytes.fromHexString(event.params.POinfoHash));

        log.info("Creating infoIPFS template with hash: {}", [event.params.POinfoHash]);
        DataSourceTemplate.createWithContext("infoIpfs", [event.params.POinfoHash], context);
        po.aboutInfo = event.params.POname;
        po.save();
    }

    // Check for array length mismatch
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
    let poName = ctx.getString(PONAME_KEY).toString();
    let hash = ctx.getBytes("hash");

    let infoIpfs = aboutInfo.toString();
    let ipfsContent = json.fromBytes(aboutInfo).toObject();

    if (ipfsContent == null) {
        log.info("IPFS content is null", []);
        return;
    }

    let descriptionValue = ipfsContent.get("description");
    let linksValue = ipfsContent.get("links");

    if (descriptionValue == null) {
        log.warning("Description is null", []);
        return;
    }

    let description = descriptionValue.toString();

    let ipfsEntity = new infoIPFS(poName);
    ipfsEntity.data = infoIpfs;
    ipfsEntity.ipfsHash = hash.toString();
    ipfsEntity.description = description;

    ipfsEntity.save();

    let po = PerpetualOrganization.load(poName);
    if (po != null) {
        po.aboutInfo = ipfsEntity.id;
        po.save();
    }
}
