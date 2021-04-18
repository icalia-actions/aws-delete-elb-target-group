import { info, getInput, setOutput } from "@actions/core";

import {
  deleteTargetGroup,
  DeleteTargetGroupInputs,
} from "./target-group-management";

export async function run() {
  const name = getInput("name");

  let targetGroupArn = await deleteTargetGroup({
    targetGroup: getInput("target-group"),
    failIfNoMatch: getInput("fail-if-no-match") == "true",
  } as DeleteTargetGroupInputs);

  if (targetGroupArn) {
    info(`Target group ARN: ${targetGroupArn}`);
    setOutput("target-group-arn", targetGroupArn);
  }

  return 0;
}
