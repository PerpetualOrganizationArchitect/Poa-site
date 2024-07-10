import { Address, dataSource, log, BigInt } from "@graphprotocol/graph-ts";
import { TaskManagerCreated as TaskManagerCreatedEvent } from "../../generated/TaskManagerFactory/TaskManagerFactory";
import { TaskManagerCreated, TaskManager,PerpetualOrganization } from "../../generated/schema";
import {DataSourceContext} from "@graphprotocol/graph-ts";
import {TaskManager as taskManagerTemplate} from "../../generated/templates";

export function handleTaskManagerCreated(event: TaskManagerCreatedEvent): void {
    log.info("Triggered handleTaskManagerCreated", []);

    let entity = new TaskManagerCreated(event.params.TaskManager.toHex());

    entity.contractAddress = event.params.TaskManager;
    entity.POname = event.params.POname;
    entity.save();

    let po = PerpetualOrganization.load(event.params.POname);
    if (po != null) {
      po.TaskManager = event.params.TaskManager.toHex();
      po.save();
    }

    let newTaskManager = new TaskManager(event.params.TaskManager.toHex());
    newTaskManager.contract = event.params.TaskManager.toHex();
    newTaskManager.POname = event.params.POname;
    newTaskManager.activeTaskAmount = BigInt.fromI32(0);
    newTaskManager.completedTaskAmount = BigInt.fromI32(0);
    newTaskManager.save();

    taskManagerTemplate.create(event.params.TaskManager);
  }