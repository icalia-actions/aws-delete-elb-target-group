# AWS Delete ELB Target Group

Deletes an AWS ELB Target Group using either a Rule ARN or the matching rules to remove

## Usage

```yaml
      - name: Delete AWS ELB Target Group
        uses: icalia-actions/aws-delete-elb-target-group@v0.0.1
        with:
          target-group: my-target-group
```
