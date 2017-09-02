# elm-aws-generate

[![CircleCI](https://img.shields.io/circleci/project/github/ktonon/elm-aws-generate/master.svg)](https://circleci.com/gh/ktonon/elm-aws-generate)

__Work in progress__

A script which reads and translates an AWS SDK [apis/*.json][] file into an Elm service. The generated code is meant to be used as a starting point to create user-friendly client libraries. The intention is to have one Elm package per AWS service.

## Usage

```shell
> elm-aws-generate --help
Options:
  --name         name of the service to generate                      [required]
  --dir          folder that contains API JSON files            [default: "api"]
  --refresh, -r  refresh with the latest API JSON files         [default: false]
  --help         Show help                                             [boolean]
```

[apis/*.json]:https://github.com/aws/aws-sdk-js/tree/master/apis
