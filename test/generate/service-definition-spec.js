const generate = require('../../src/generate');

const gen = generate.serviceDefinition;

describe('generate.serviceDefinition(metadata)', () => {
  it('works for ACM', () => {
    gen({
      apiVersion: '2015-12-08',
      endpointPrefix: 'acm',
      jsonVersion: '1.1',
      protocol: 'json',
      serviceAbbreviation: 'ACM',
      serviceFullName: 'AWS Certificate Manager',
      signatureVersion: 'v4',
      targetPrefix: 'CertificateManager',
      uid: 'acm-2015-12-08',
    }).should.equal(`{-| Configuration for this service.
-}
service : AWS.Core.Service.Region -> AWS.Core.Service.Service
service =
    AWS.Core.Service.defineRegional
        "acm"
        "2015-12-08"
        AWS.Core.Service.json
        AWS.Core.Service.signV4
        (AWS.Core.Service.setJsonVersion "1.1" >> AWS.Core.Service.setTargetPrefix "CertificateManager")
`);
  });

  it('works for CloudFront', () => {
    gen({
      apiVersion: '2016-11-25',
      endpointPrefix: 'cloudfront',
      globalEndpoint: 'cloudfront.amazonaws.com',
      protocol: 'rest-xml',
      serviceAbbreviation: 'CloudFront',
      serviceFullName: 'Amazon CloudFront',
      signatureVersion: 'v4',
      uid: 'cloudfront-2016-11-2',
    }).should.equal(`{-| Configuration for this service.
-}
service : AWS.Core.Service.Service
service =
    AWS.Core.Service.defineGlobal
        "cloudfront"
        "2016-11-25"
        AWS.Core.Service.restXml
        AWS.Core.Service.signV4
        identity
`);
  });

  it('works for Organizations', () => {
    gen({
      apiVersion: '2016-11-28',
      endpointPrefix: 'organizations',
      jsonVersion: '1.1',
      protocol: 'json',
      serviceAbbreviation: 'Organizations',
      serviceFullName: 'AWS Organizations',
      signatureVersion: 'v4',
      targetPrefix: 'AWSOrganizationsV20161128',
      timestampFormat: 'unixTimestamp',
      uid: 'organizations-2016-11-2',
    }).should.equal(`{-| Configuration for this service.
-}
service : AWS.Core.Service.Region -> AWS.Core.Service.Service
service =
    AWS.Core.Service.defineRegional
        "organizations"
        "2016-11-28"
        AWS.Core.Service.json
        AWS.Core.Service.signV4
        (AWS.Core.Service.setJsonVersion "1.1" >> AWS.Core.Service.setTargetPrefix "AWSOrganizationsV20161128" >> AWS.Core.Service.setTimestampFormat AWS.Core.Service.unixTimestamp)
`);
  });
});
