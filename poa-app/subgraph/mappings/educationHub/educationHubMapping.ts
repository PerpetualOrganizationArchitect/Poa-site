import { log, json, Bytes, BigInt, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { ModuleCreated, ModuleCompleted as ModuleCompletedEvent } from "../../generated/templates/EducationHub/EducationHub";
import { Module, ModuleInfo, ModuleAnswer, EducationHubContract, ModuleCompletion, User } from "../../generated/schema";
import { dataSource } from '@graphprotocol/graph-ts';
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { JSONValueKind } from "@graphprotocol/graph-ts";

export function handleModuleCreated(event: ModuleCreated): void {
  log.info("Triggered handleModuleCreated", []);

    let module = new Module(event.params.id.toHex() + "-" + event.address.toHex());
  module.name = event.params.name;
  module.ipfsHash = event.params.ipfsHash;
  module.payout = event.params.payout;
  module.educationHub = event.address.toHex();
  
  let context = new DataSourceContext();
  context.setString("hash", event.params.ipfsHash);

  log.info("Creating ModuleInfo template with hash: {}", [module.ipfsHash]);
  DataSourceTemplate.createWithContext("moduleInfo", [module.ipfsHash], context);
  module.info = event.params.ipfsHash;

  module.save();
}

export function handleModuleIPFS(moduleInfoBytes: Bytes): void {
  log.info("Triggered handleModuleIPFS", []);

  let ctx = dataSource.context();
  let hash = ctx.getString("hash");

  let moduleInfoEntity = new ModuleInfo(hash);

  let ipfsContent = json.fromBytes(moduleInfoBytes).toObject();
  if (!ipfsContent) {
    log.error("Failed to parse IPFS content for module", []);
    return;
  }

  let name = ipfsContent.get("name");
  moduleInfoEntity.name = name && !name.isNull() ? name.toString() : "";

  let description = ipfsContent.get("description");
  moduleInfoEntity.description = description && !description.isNull() ? description.toString() : "";

  let link = ipfsContent.get("link");
  moduleInfoEntity.link = link && !link.isNull() ? link.toString() : "";

  // Handling ModuleAnswer within ModuleInfo
  let answers = ipfsContent.get("answers");
  if (answers && !answers.isNull() && answers.kind == JSONValueKind.ARRAY) {
    let answersArray = answers.toArray();
    for (let i = 0; i < answersArray.length; i++) {
      let answerEntity = new ModuleAnswer(hash + "-" + i.toString());
      answerEntity.moduleInfo = moduleInfoEntity.id;
      answerEntity.answer = answersArray[i].toString();
      answerEntity.save();
    }
  }

  moduleInfoEntity.save();
  log.info("Module IPFS data updated successfully for ModuleInfo ID: {}", [hash]);
}

export function handleModuleCompleted(event: ModuleCompletedEvent): void {
  log.info("Triggered handleModuleCompleted", []);

  let moduleCompletion = new ModuleCompletion(event.params.completer.toHex() + "-" + event.params.id.toString());
  moduleCompletion.module = event.params.id.toString() + "-" + event.address.toHex();
  moduleCompletion.user = event.params.completer.toHex();
  moduleCompletion.save();

}
