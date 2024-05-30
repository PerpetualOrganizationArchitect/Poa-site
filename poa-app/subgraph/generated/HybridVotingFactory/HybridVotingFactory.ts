// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class HybridVotingContractCreated extends ethereum.Event {
  get params(): HybridVotingContractCreated__Params {
    return new HybridVotingContractCreated__Params(this);
  }
}

export class HybridVotingContractCreated__Params {
  _event: HybridVotingContractCreated;

  constructor(event: HybridVotingContractCreated) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get hybridVotingAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get POname(): string {
    return this._event.parameters[2].value.toString();
  }

  get quorumPercentage(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get DDpercent(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get PTpercent(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class HybridVotingFactory extends ethereum.SmartContract {
  static bind(address: Address): HybridVotingFactory {
    return new HybridVotingFactory("HybridVotingFactory", address);
  }

  createHybridVoting(
    _ParticipationToken: Address,
    _DemocracyToken: Address,
    _nftMembership: Address,
    _allowedRoleNames: Array<string>,
    _quadraticVotingEnabled: boolean,
    _democracyVoteWeight: BigInt,
    _participationVoteWeight: BigInt,
    _treasuryAddress: Address,
    POname: string,
    _quorumPercentage: BigInt,
  ): Address {
    let result = super.call(
      "createHybridVoting",
      "createHybridVoting(address,address,address,string[],bool,uint256,uint256,address,string,uint256):(address)",
      [
        ethereum.Value.fromAddress(_ParticipationToken),
        ethereum.Value.fromAddress(_DemocracyToken),
        ethereum.Value.fromAddress(_nftMembership),
        ethereum.Value.fromStringArray(_allowedRoleNames),
        ethereum.Value.fromBoolean(_quadraticVotingEnabled),
        ethereum.Value.fromUnsignedBigInt(_democracyVoteWeight),
        ethereum.Value.fromUnsignedBigInt(_participationVoteWeight),
        ethereum.Value.fromAddress(_treasuryAddress),
        ethereum.Value.fromString(POname),
        ethereum.Value.fromUnsignedBigInt(_quorumPercentage),
      ],
    );

    return result[0].toAddress();
  }

  try_createHybridVoting(
    _ParticipationToken: Address,
    _DemocracyToken: Address,
    _nftMembership: Address,
    _allowedRoleNames: Array<string>,
    _quadraticVotingEnabled: boolean,
    _democracyVoteWeight: BigInt,
    _participationVoteWeight: BigInt,
    _treasuryAddress: Address,
    POname: string,
    _quorumPercentage: BigInt,
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "createHybridVoting",
      "createHybridVoting(address,address,address,string[],bool,uint256,uint256,address,string,uint256):(address)",
      [
        ethereum.Value.fromAddress(_ParticipationToken),
        ethereum.Value.fromAddress(_DemocracyToken),
        ethereum.Value.fromAddress(_nftMembership),
        ethereum.Value.fromStringArray(_allowedRoleNames),
        ethereum.Value.fromBoolean(_quadraticVotingEnabled),
        ethereum.Value.fromUnsignedBigInt(_democracyVoteWeight),
        ethereum.Value.fromUnsignedBigInt(_participationVoteWeight),
        ethereum.Value.fromAddress(_treasuryAddress),
        ethereum.Value.fromString(POname),
        ethereum.Value.fromUnsignedBigInt(_quorumPercentage),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class CreateHybridVotingCall extends ethereum.Call {
  get inputs(): CreateHybridVotingCall__Inputs {
    return new CreateHybridVotingCall__Inputs(this);
  }

  get outputs(): CreateHybridVotingCall__Outputs {
    return new CreateHybridVotingCall__Outputs(this);
  }
}

export class CreateHybridVotingCall__Inputs {
  _call: CreateHybridVotingCall;

  constructor(call: CreateHybridVotingCall) {
    this._call = call;
  }

  get _ParticipationToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _DemocracyToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _nftMembership(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _allowedRoleNames(): Array<string> {
    return this._call.inputValues[3].value.toStringArray();
  }

  get _quadraticVotingEnabled(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get _democracyVoteWeight(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _participationVoteWeight(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get _treasuryAddress(): Address {
    return this._call.inputValues[7].value.toAddress();
  }

  get POname(): string {
    return this._call.inputValues[8].value.toString();
  }

  get _quorumPercentage(): BigInt {
    return this._call.inputValues[9].value.toBigInt();
  }
}

export class CreateHybridVotingCall__Outputs {
  _call: CreateHybridVotingCall;

  constructor(call: CreateHybridVotingCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}
