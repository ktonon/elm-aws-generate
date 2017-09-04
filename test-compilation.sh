#!/usr/bin/env bash

set -e

rm -rf sandbox
mkdir sandbox
cd sandbox

GEN="../bin/elm-aws-generate.js --no-format --name"

# protocol query
$GEN autoscaling
$GEN cloudformation
$GEN cloudsearch
$GEN elasticache
$GEN elasticbeanstalk
$GEN elasticloadbalancing
$GEN elasticloadbalancingv2
$GEN email
$GEN iam
# $GEN importexport # signatureVersion=v2
$GEN monitoring
$GEN rds
$GEN redshift
# $GEN sdb version=undefined
$GEN sns
$GEN sqs
$GEN sts

# protocol json
$GEN acm
$GEN application-autoscaling
$GEN appstream
$GEN athena
$GEN AWSMigrationHub
$GEN budgets
$GEN cloudhsm
$GEN cloudtrail
$GEN cloudhsmv2
$GEN codebuild
$GEN codecommit
$GEN codedeploy
$GEN codepipeline
$GEN codestar
$GEN cognito-identity
$GEN cognito-idp
$GEN config
$GEN cur
$GEN datapipeline
$GEN dax
$GEN devicefarm
$GEN directconnect
$GEN discovery
$GEN dms
$GEN ds
# $GEN dynamodb # recursive type
$GEN ecr
$GEN ecs
# $GEN elasticmapreduce # recursive types
$GEN entitlement.marketplace
$GEN events
$GEN firehose
$GEN gamelift
$GEN glue
$GEN health
$GEN inspector
$GEN kinesis
$GEN kinesisanalytics
$GEN kms
$GEN lightsail
$GEN logs
$GEN machinelearning
$GEN marketplacecommerceanalytics
$GEN meteringmarketplace
$GEN mturk-requester
$GEN opsworks
$GEN opsworkscm
# $GEN organizations # recursive types
$GEN rekognition
$GEN resourcegroupstaggingapi
$GEN route53domains
$GEN servicecatalog
$GEN shield
$GEN sms
$GEN snowball
$GEN ssm
$GEN states
$GEN storagegateway
# $GEN streams.dynamodb # recursive types
$GEN support
$GEN swf
$GEN waf
$GEN waf-regional
$GEN workspaces

# # protocol rest-json
# $GEN apigateway
# $GEN batch
# $GEN clouddirectory
# $GEN cloudsearchdomain
# $GEN cognito-sync
# $GEN elasticfilesystem
# $GEN elastictranscoder
# $GEN es
# $GEN glacier
# $GEN greengrass # version=undefined
# $GEN iot
# $GEN iot-data
# $GEN lambda
# $GEN lex-models
# $GEN mobileanalytics
# $GEN pinpoint # version=undefined
# $GEN polly
# $GEN runtime.lex
# $GEN workdocs
# $GEN xray
#
# # protocol rest-xml
# $GEN cloudfront
# $GEN route53
# $GEN s3 # signatureVersion s3
#
# # protocol ec2
# $GEN ec2

elm make --yes
elm make --docs=docs.json
cp docs.json ..
