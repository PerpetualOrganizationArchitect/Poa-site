import { dataSource, json, Bytes, log, DataSourceTemplate, DataSourceContext } from "@graphprotocol/graph-ts"
import { Mint as MintEvent, TaskManagerAddressSet, TokenRequested, TokenRequestApproved } from "../../generated/templates/ParticipationToken/ParticipationToken"
import { PTTokenMintEvent, PTToken, User, TokenRequest, TokenRequestInfo } from "../../generated/schema"

export function handleTokenMint(event: MintEvent): void {
  log.info("Triggered handleTokenMint", [])

  let entity = new PTTokenMintEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  entity.to = event.params.to
  entity.token = event.address.toHex()
  entity.amount = event.params.amount
  entity.save()

  let token = PTToken.load(event.address.toHex())
  if (token == null) {
    //return if token not found
    log.error("PTToken not found: {}", [event.address.toHex()])
    return
  }
  token.supply = token.supply.plus(event.params.amount)
  token.save()

  let user = User.load(token.POname+'-'+event.params.to.toHex())
  if (user != null) {
    user.ptTokenBalance = user.ptTokenBalance.plus(event.params.amount)
    user.save()
  }
}

export function handleTaskManagerAddressSet(event: TaskManagerAddressSet): void {

    let token = PTToken.load(event.address.toHex());
    if (token != null) {
      token.taskManagerAddress = event.params.taskManagerAddress;
      token.save();
    }
    

}

export function handleTokenRequest(event: TokenRequested): void {
  log.info("Triggered handleTokenRequest", []);

  let tokenRequest = new TokenRequest(event.params.requestId.toString() + "-" + event.address.toHex());
  // load partciaption token 
  let token = PTToken.load(event.address.toHex());
  if (token == null) {
    log.error("PTToken not found: {}", [event.address.toHex()]);
    return;
  }
  tokenRequest.token = token.id;
  tokenRequest.user = token.POname + '-' + event.params.requester.toHex();
  tokenRequest.amount = event.params.amount;
  tokenRequest.ipfsHash = event.params.ipfsHash;
  tokenRequest.approved = false; 
  tokenRequest.save();

  // Create context for IPFS data fetching
  let context = new DataSourceContext();
  context.setString("hash", event.params.ipfsHash);

  log.info("Creating TokenRequestInfo template with hash: {}", [tokenRequest.ipfsHash]);
  DataSourceTemplate.createWithContext("tokenRequestInfo", [tokenRequest.ipfsHash], context);
}

export function handleTokenRequestApproved(event: TokenRequestApproved): void {
  log.info("Triggered handleTokenRequestApproved", []);

  let tokenRequest = TokenRequest.load(event.params.requestId.toString() + "-" + event.address.toHex());
  if (tokenRequest == null) {
    log.error("TokenRequest not found: {}", [event.params.requestId.toString()]);
    return;
  }

  tokenRequest.approved = true;
  tokenRequest.save();

  let user = User.load(event.params.approver.toHex());
  if (!user) {
    user = new User(event.params.approver.toHex());
    user.save();
  }
}

export function handleTokenRequestIPFS(taskInfo: Bytes): void {
  log.info("Triggered handleTokenRequestIPFS", []);

  let ctx = dataSource.context();
  let hash = ctx.getString("hash");

  let tokenRequestInfoEntity = new TokenRequestInfo(hash);

  // Parse the IPFS content
  let ipfsContent = json.fromBytes(taskInfo).toObject();
  if (!ipfsContent) {
    log.error("Failed to parse IPFS content for TokenRequest", []);
    return;
  }

  let title = ipfsContent.get("title");
  tokenRequestInfoEntity.title = title && !title.isNull() ? title.toString() : "";

  let description = ipfsContent.get("description");
  tokenRequestInfoEntity.description = description && !description.isNull() ? description.toString() : "";

  tokenRequestInfoEntity.save();
  log.info("TokenRequest IPFS data updated successfully for TokenRequestInfo ID: {}", [hash]);
}