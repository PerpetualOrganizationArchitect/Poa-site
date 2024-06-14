import { log,json, DataSourceTemplate, Bytes } from "@graphprotocol/graph-ts"
import { TaskCreated as TaskCreatedEvent, TaskClaimed as TaskClaimedEvent, TaskUpdated as TaskUpdatedEvent, TaskCompleted as TaskCompletedEvent, ProjectCreated as ProjectCreatedEvent, ProjectDeleted as ProjectDeletedEvent } from "../../generated/templates/TaskManager/TaskManager"
import {TaskInfo, TaskManager, Task, Project } from "../../generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'
import { DataSourceContext } from "@graphprotocol/graph-ts";
import { JSONValueKind } from "@graphprotocol/graph-ts";


export function handleTaskCreated(event: TaskCreatedEvent): void {
  log.info("Triggered handleTaskCreated", [])

  let task = new Task(event.params.id.toHex()+"-"+event.address.toHex())
  task.payout = event.params.payout
  task.ipfsHash = event.params.ipfsHash
  task.project = event.params.projectName+"-"+event.address.toHex()
  task.completed = false
  task.taskManager = event.address.toHex()


  let context = new DataSourceContext();
  context.setString("taskId", event.params.id.toHex());
  context.setString("taskManagerAddress", event.address.toHex());

  
  log.info("Creating infoIPFS template with hash: {}", [task.ipfsHash]);
  DataSourceTemplate.createWithContext("infoIpfs", [task.ipfsHash], context);
  
  task.taskInfo = task.ipfsHash

  task.save()
}


export function handleTaskClaimed(event: TaskClaimedEvent): void {
    log.info("Triggered handleTaskClaimed", [])
  
    let task = Task.load(event.params.id.toHex()+"-"+event.address.toHex())

    if (!task) {
      log.error("Task not found: {}", [event.params.id.toHex()])
      return
    }
    let taskManager = TaskManager.load(event.address.toHex());
    if (!taskManager) {
      log.error("TaskManager not found: {}", [event.address.toHex()])
      return
    }
    task.claimer = event.params.claimer
    task.user = taskManager.POname + '-' + event.params.claimer.toHex()
    

    let context = new DataSourceContext();
    context.setString("taskId", event.params.id.toHex());
    context.setString("taskManagerAddress", event.address.toHex());


    log.info("Creating infoIPFS template with hash: {}", [task.ipfsHash]);
    DataSourceTemplate.createWithContext("infoIpfs", [task.ipfsHash], context);
    task.taskInfo = task.ipfsHash
    task.save()
}

export function handleTaskIPFS(taskInfo: Bytes): void {
  log.info("Triggered handleTaskIPFS", []);

  // Obtain context values
  let ctx = dataSource.context();
  let taskId = ctx.getString("taskId");
  let taskManagerAddress = ctx.getString("taskManagerAddress");

  // Load the task using the ID constructed from taskId and taskManagerAddress
  let task = Task.load(taskId + "-" + taskManagerAddress);
  if (!task) {
    log.error("Task not found: {}", [taskId]);
    return;
  }

  // Deserialize the IPFS content to JSON
  let ipfsContent = json.fromBytes(taskInfo).toObject();
  if (!ipfsContent) {
    log.error("Failed to parse IPFS content for task", []);
    return;
  }

  // Create or update TaskInfo from the IPFS data
  let taskInfoEntity = TaskInfo.load(taskId);
  if (!taskInfoEntity) {
    taskInfoEntity = new TaskInfo(taskId);
  }

  // Populate the TaskInfo fields from IPFS JSON data, with correct null checks
  let name = ipfsContent.get("name");
  taskInfoEntity.name = name && !name.isNull() ? name.toString() : "";

  let description = ipfsContent.get("description");
  taskInfoEntity.description = description && !description.isNull() ? description.toString() : "";

  let location = ipfsContent.get("location");
  taskInfoEntity.location = location && !location.isNull() ? location.toString() : "";

  let difficulty = ipfsContent.get("difficulty");
  taskInfoEntity.difficulty = difficulty && !difficulty.isNull() ? difficulty.toString() : "";

  let estimatedHours = ipfsContent.get("estimatedHours");
  taskInfoEntity.estimatedHours = estimatedHours && !estimatedHours.isNull() ? estimatedHours.toString() : "";

  let submissionContent = ipfsContent.get("submissionContent");
  taskInfoEntity.submissionContent = submissionContent && !submissionContent.isNull() ? submissionContent.toString() : "";

  taskInfoEntity.save();
  log.info("Task IPFS data updated successfully for {}", [task.id]);
}


export function handleTaskUpdated(event: TaskUpdatedEvent): void {
    log.info("Triggered handleTaskUpdated", [])
  
    let task = Task.load(event.params.id.toHex()+ "-"+event.address.toHex())
    if (!task) {
      log.error("Task not found: {}", [event.params.id.toHex()])
      return
    }
    task.payout = event.params.payout
    task.ipfsHash = event.params.ipfsHash
    task.save()
  }

export function handleTaskCompleted(event: TaskCompletedEvent): void {
    log.info("Triggered handleTaskCompleted", [])
  
    let task = Task.load(event.params.id.toHex() + "-"+event.address.toHex())
    if (!task) {
      log.error("Task not found: {}", [event.params.id.toHex()])
      return
    }
    task.completed = true
    task.save()
  }

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  log.info("Triggered handleProjectCreated", [])

    let project = new Project(event.params.projectName+"-"+event.address.toHex())
    project.name = event.params.projectName
    project.taskManager = event.address.toHex()
    project.deleted = false
    project.save()
}

export function handleProjectDeleted(event: ProjectDeletedEvent): void {
    log.info("Triggered handleProjectDeleted", [])
      
    let project = Project.load(event.params.projectName+"-"+event.address.toHex());
    if (!project) {
      log.error("Project not found: {}", [event.params.projectName])
      return
    }
    project.deleted = true
    project.save()
  }
