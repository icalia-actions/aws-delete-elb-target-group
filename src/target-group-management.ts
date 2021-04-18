import ECS, {
  TargetGroup,
  TargetGroupArn,
  DeleteTargetGroupInput,
  DescribeTargetGroupsInput,
} from "aws-sdk/clients/elbv2";

export interface DeleteTargetGroupInputs {
  targetGroup: string;
  failIfNoMatch: boolean;
}

function getClient(): ECS {
  return new ECS({
    customUserAgent: "icalia-actions/aws-action",
    region: process.env.AWS_DEFAULT_REGION,
  });
}

async function findTargetGroup(
  inputs: DeleteTargetGroupInputs
): Promise<TargetGroup | undefined> {
  const { failIfNoMatch, targetGroup: targetGroupName } = inputs;

  try {
    const { TargetGroups } = await getClient()
      .describeTargetGroups({
        Names: [targetGroupName],
      } as DescribeTargetGroupsInput)
      .promise();

    const targetGroup = TargetGroups?.pop();
    if (!targetGroup) throw `Target group "${targetGroupName}" not found`;

    return targetGroup;
  } catch (error) {
    if (!failIfNoMatch) return;
    else throw error;
  }
}

function validateInputs(inputs: DeleteTargetGroupInputs) {
  const { targetGroup } = inputs;
  if (targetGroup) return;

  throw 'You must specify "target-group" with the name or ARN of the target group to be deleted';
}

export async function deleteTargetGroup(
  inputs: DeleteTargetGroupInputs
): Promise<string | undefined> {
  validateInputs(inputs);
  const { targetGroup } = inputs;

  let TargetGroupArn: TargetGroupArn | undefined;
  if (!targetGroup.startsWith("arn:")) {
    const group = await findTargetGroup(inputs);
    TargetGroupArn = group?.TargetGroupArn;
  } else TargetGroupArn = targetGroup;

  if (!TargetGroupArn) return;

  await getClient()
    .deleteTargetGroup({ TargetGroupArn } as DeleteTargetGroupInput)
    .promise();

  return targetGroup;
}
