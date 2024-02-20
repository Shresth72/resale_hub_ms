# Test locally using AWS Service Application Model (SAM) and AWS CDK
test_lambda:
	sam local invoke $(fn)Lambda --no-event -t ./cdk.out/ProductServiceStack.template.json

cdk:
	cdk synth

cdk-local:
	cdk synth --no-staging

deploy:
	cdk deploy --verbose --trace

destroy:
	cdk destroy --verbose



.PHONY: test_lambda cdk deploy destroy
