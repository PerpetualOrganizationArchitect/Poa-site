import { log } from "@graphprotocol/graph-ts"
import { TaskCreated as TaskCreatedEvent, TaskClaimed as TaskClaimedEvent, TaskUpdated as TaskUpdatedEvent, TaskCompleted as TaskCompletedEvent, ProjectCreated as ProjectCreatedEvent, ProjectDeleted as ProjectDeletedEvent } from "../../generated/templates/TaskManager/TaskManager"
import { TaskManager, Task, Project } from "../../generated/schema"
import { dataSource } from '@graphprotocol/graph-ts'

export function handleTaskCreated(event: TaskCreatedEvent): void {
  log.info("Triggered handleTaskCreated", [])

  let task = new Task(event.params.id.toHex())
  task.payout = event.params.payout
  task.ipfsHash = event.params.ipfsHash
  task.project = event.params.projectName
  task.completed = false
  task.taskManager = event.address.toHex()


    task.save()

}

export function handleTaskClaimed(event: TaskClaimedEvent): void {
    log.info("Triggered handleTaskClaimed", [])
  
    let task = Task.load(event.params.id.toHex())

    if (!task) {
      log.error("Task not found: {}", [event.params.id.toHex()])
      return
    }
    task.claimer = event.params.claimer
    task.save()
  }

export function handleTaskUpdated(event: TaskUpdatedEvent): void {
    log.info("Triggered handleTaskUpdated", [])
  
    let task = Task.load(event.params.id.toHex())
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
  
    let task = Task.load(event.params.id.toHex())
    if (!task) {
      log.error("Task not found: {}", [event.params.id.toHex()])
      return
    }
    task.completed = true
    task.save()
  }

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  log.info("Triggered handleProjectCreated", [])

    let project = new Project(event.params.projectName)
    project.name = event.params.projectName
    project.taskManager = event.address.toHex()
    project.deleted = false
    project.save()
}

export function handleProjectDeleted(event: ProjectDeletedEvent): void {
    log.info("Triggered handleProjectDeleted", [])
      
    let project = Project.load(event.params.projectName)
    if (!project) {
      log.error("Project not found: {}", [event.params.projectName])
      return
    }
    project.deleted = true
    project.save()
  }
