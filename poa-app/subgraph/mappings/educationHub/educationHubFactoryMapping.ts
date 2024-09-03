import { EducationHubCreated } from "../../generated/EducationHubFactory/EducationHubFactory";
import { EducationHubContract, PerpetualOrganization } from "../../generated/schema";
import {EducationHub as educationHubTemplate} from "../../generated/templates";

function handleEducationHubCreated(event: EducationHubCreated): void {
  let entity = new EducationHubContract(event.params.educationHubAddress.toHex());

  entity.contractAddress = event.params.educationHubAddress;
  entity.POname = event.params.POname;
  entity.save();

  let po = PerpetualOrganization.load(event.params.POname);
  if (po != null) {
    po.EducationHubContract = event.params.educationHubAddress.toHex();
    po.save();
  }

  educationHubTemplate.create(event.params.educationHubAddress);
}