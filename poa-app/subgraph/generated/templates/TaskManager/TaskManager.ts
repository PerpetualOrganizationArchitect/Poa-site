// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ProjectCreated extends ethereum.Event {
  get params(): ProjectCreated__Params {
    return new ProjectCreated__Params(this);
  }
}

export class ProjectCreated__Params {
  _event: ProjectCreated;

  constructor(event: ProjectCreated) {
    this._event = event;
  }

  get projectName(): string {
    return this._event.parameters[0].value.toString();
  }
}

export class ProjectDeleted extends ethereum.Event {
  get params(): ProjectDeleted__Params {
    return new ProjectDeleted__Params(this);
  }
}

export class ProjectDeleted__Params {
  _event: ProjectDeleted;

  constructor(event: ProjectDeleted) {
    this._event = event;
  }

  get projectName(): string {
    return this._event.parameters[0].value.toString();
  }
}

export class TaskClaimed extends ethereum.Event {
  get params(): TaskClaimed__Params {
    return new TaskClaimed__Params(this);
  }
}

export class TaskClaimed__Params {
  _event: TaskClaimed;

  constructor(event: TaskClaimed) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get claimer(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TaskCompleted extends ethereum.Event {
  get params(): TaskCompleted__Params {
    return new TaskCompleted__Params(this);
  }
}

export class TaskCompleted__Params {
  _event: TaskCompleted;

  constructor(event: TaskCompleted) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get completer(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TaskCreated extends ethereum.Event {
  get params(): TaskCreated__Params {
    return new TaskCreated__Params(this);
  }
}

export class TaskCreated__Params {
  _event: TaskCreated;

  constructor(event: TaskCreated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get payout(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get ipfsHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get projectName(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class TaskUpdated extends ethereum.Event {
  get params(): TaskUpdated__Params {
    return new TaskUpdated__Params(this);
  }
}

export class TaskUpdated__Params {
  _event: TaskUpdated;

  constructor(event: TaskUpdated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get payout(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get ipfsHash(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class TaskManager__tasksResult {
  value0: BigInt;
  value1: BigInt;
  value2: boolean;
  value3: Address;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: boolean,
    value3: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    map.set("value3", ethereum.Value.fromAddress(this.value3));
    return map;
  }

  getId(): BigInt {
    return this.value0;
  }

  getPayout(): BigInt {
    return this.value1;
  }

  getIsCompleted(): boolean {
    return this.value2;
  }

  getClaimer(): Address {
    return this.value3;
  }
}

export class TaskManager extends ethereum.SmartContract {
  static bind(address: Address): TaskManager {
    return new TaskManager("TaskManager", address);
  }

  nextTaskId(): BigInt {
    let result = super.call("nextTaskId", "nextTaskId():(uint256)", []);

    return result[0].toBigInt();
  }

  try_nextTaskId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("nextTaskId", "nextTaskId():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  nftMembership(): Address {
    let result = super.call("nftMembership", "nftMembership():(address)", []);

    return result[0].toAddress();
  }

  try_nftMembership(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "nftMembership",
      "nftMembership():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tasks(param0: BigInt): TaskManager__tasksResult {
    let result = super.call(
      "tasks",
      "tasks(uint256):(uint256,uint256,bool,address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new TaskManager__tasksResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBoolean(),
      result[3].toAddress()
    );
  }

  try_tasks(param0: BigInt): ethereum.CallResult<TaskManager__tasksResult> {
    let result = super.tryCall(
      "tasks",
      "tasks(uint256):(uint256,uint256,bool,address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TaskManager__tasksResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBoolean(),
        value[3].toAddress()
      )
    );
  }

  token(): Address {
    let result = super.call("token", "token():(address)", []);

    return result[0].toAddress();
  }

  try_token(): ethereum.CallResult<Address> {
    let result = super.tryCall("token", "token():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _nftMembership(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _allowedRoleNames(): Array<string> {
    return this._call.inputValues[2].value.toStringArray();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimTaskCall extends ethereum.Call {
  get inputs(): ClaimTaskCall__Inputs {
    return new ClaimTaskCall__Inputs(this);
  }

  get outputs(): ClaimTaskCall__Outputs {
    return new ClaimTaskCall__Outputs(this);
  }
}

export class ClaimTaskCall__Inputs {
  _call: ClaimTaskCall;

  constructor(call: ClaimTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ClaimTaskCall__Outputs {
  _call: ClaimTaskCall;

  constructor(call: ClaimTaskCall) {
    this._call = call;
  }
}

export class CompleteTaskCall extends ethereum.Call {
  get inputs(): CompleteTaskCall__Inputs {
    return new CompleteTaskCall__Inputs(this);
  }

  get outputs(): CompleteTaskCall__Outputs {
    return new CompleteTaskCall__Outputs(this);
  }
}

export class CompleteTaskCall__Inputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CompleteTaskCall__Outputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }
}

export class CreateProjectCall extends ethereum.Call {
  get inputs(): CreateProjectCall__Inputs {
    return new CreateProjectCall__Inputs(this);
  }

  get outputs(): CreateProjectCall__Outputs {
    return new CreateProjectCall__Outputs(this);
  }
}

export class CreateProjectCall__Inputs {
  _call: CreateProjectCall;

  constructor(call: CreateProjectCall) {
    this._call = call;
  }

  get projectName(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class CreateProjectCall__Outputs {
  _call: CreateProjectCall;

  constructor(call: CreateProjectCall) {
    this._call = call;
  }
}

export class CreateTaskCall extends ethereum.Call {
  get inputs(): CreateTaskCall__Inputs {
    return new CreateTaskCall__Inputs(this);
  }

  get outputs(): CreateTaskCall__Outputs {
    return new CreateTaskCall__Outputs(this);
  }
}

export class CreateTaskCall__Inputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }

  get _payout(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get ipfsHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get projectName(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class CreateTaskCall__Outputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }
}

export class DeleteProjectCall extends ethereum.Call {
  get inputs(): DeleteProjectCall__Inputs {
    return new DeleteProjectCall__Inputs(this);
  }

  get outputs(): DeleteProjectCall__Outputs {
    return new DeleteProjectCall__Outputs(this);
  }
}

export class DeleteProjectCall__Inputs {
  _call: DeleteProjectCall;

  constructor(call: DeleteProjectCall) {
    this._call = call;
  }

  get projectName(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class DeleteProjectCall__Outputs {
  _call: DeleteProjectCall;

  constructor(call: DeleteProjectCall) {
    this._call = call;
  }
}

export class UpdateTaskCall extends ethereum.Call {
  get inputs(): UpdateTaskCall__Inputs {
    return new UpdateTaskCall__Inputs(this);
  }

  get outputs(): UpdateTaskCall__Outputs {
    return new UpdateTaskCall__Outputs(this);
  }
}

export class UpdateTaskCall__Inputs {
  _call: UpdateTaskCall;

  constructor(call: UpdateTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _payout(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get ipfsHash(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class UpdateTaskCall__Outputs {
  _call: UpdateTaskCall;

  constructor(call: UpdateTaskCall) {
    this._call = call;
  }
}
