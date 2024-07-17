import { describe, expect, it } from '@jest/globals';
import { lambdaHandler } from '../../app';
import { generateLambdaEvent } from './utils';
import {
    EXPECTED_RHODE_ISLAND_TEMPLATE_FIELDS,
    EXPECTED_UTAH_TEMPLATE_FIELDS,
    RHODE_ISLAND_TEMPLATE,
    UTAH_TEMPLATE,
} from './payloads';
import { APIGatewayProxyResult } from 'aws-lambda';

describe('Unit test for app handler', function () {
    it('should return a 200 response for utah pdf template', async () => {
        const event = generateLambdaEvent(UTAH_TEMPLATE);
        const result = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);

        const jsonBody = JSON.parse(result.body);

        expect(jsonBody).toHaveProperty('message');
        expect(jsonBody.message).toEqual('Successfully Generated PDF Form Field List');

        expect(jsonBody).toHaveProperty('formFieldsList');

        expect(jsonBody.formFieldsList).toEqual(EXPECTED_UTAH_TEMPLATE_FIELDS);
    });

    it('should return a 200 response for rhode island pdf template', async () => {
        const event = generateLambdaEvent(RHODE_ISLAND_TEMPLATE);
        const result = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);

        const jsonBody = JSON.parse(result.body);

        expect(jsonBody).toHaveProperty('message');
        expect(jsonBody.message).toEqual('Successfully Generated PDF Form Field List');

        expect(jsonBody).toHaveProperty('formFieldsList');

        expect(jsonBody.formFieldsList).toEqual(EXPECTED_RHODE_ISLAND_TEMPLATE_FIELDS);
    });

    it('No body passed in event error', async () => {
        //@ts-expect-error - We are expecting an error to be thrown
        const event: APIGatewayProxyEvent = {
            headers: {
                'Content-Type': 'application/json',
            },
            httpMethod: 'POST',
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: null,
            path: '/hello',
            pathParameters: null,
            queryStringParameters: null,
            requestContext: {
                accountId: '123456789012',
                apiId: '1234567890',
                domainName: 'localhost:3000',
                extendedRequestId: undefined,
                authorizer: undefined,
                httpMethod: 'POST',
                identity: {
                    accountId: null,
                    apiKey: null,
                    caller: null,
                    cognitoAuthenticationProvider: null,
                    cognitoAuthenticationType: null,
                    cognitoIdentityPoolId: null,
                    sourceIp: '127.0.0.1',
                    user: null,
                    userAgent: 'Custom User Agent String',
                    userArn: null,
                    accessKey: null,
                    apiKeyId: null,
                    clientCert: null,
                    principalOrgId: null,
                    cognitoIdentityId: null,
                },
                path: '/hello',
                protocol: 'HTTP/1.1',
                requestId: 'f68b0e88-329b-4a65-9e14-f5ddcaa8e09f',
                requestTimeEpoch: 1720797016,
                resourceId: '123456',
                resourcePath: '/hello',
                stage: 'dev',
            },
            resource: '/hello',
            stageVariables: null,
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(500);

        const jsonBody = JSON.parse(result.body);

        expect(jsonBody).toHaveProperty('message');
        expect(jsonBody.message).toEqual('No data was passed in the request body.');
    });

    it('No pdfTemplate in body error', async () => {
        const event = generateLambdaEvent({});

        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(500);

        const jsonBody = JSON.parse(result.body);

        expect(jsonBody).toHaveProperty('message');
        expect(jsonBody.message).toEqual('No pdfTemplate was passed in the request body.');
    });
});
