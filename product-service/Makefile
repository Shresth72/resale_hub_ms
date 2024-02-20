# Test locally using AWS Service Application Model (SAM) and AWS CDK

# Local
test_lambda:
	sam local invoke $(fn)Lambda --no-event -t ./cdk.out/ProductServiceStack.template.json

dev: 
	cdk synth && sam local start-api -t cdk.out/ProductServiceStack.template.json

# AWS
cdk:
	cdk synth

deploy:
	cdk deploy --verbose --trace

destroy:
	cdk destroy --verbose

.PHONY: test_lambda cdk deploy destroy dev cdk-local
