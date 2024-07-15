import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PDFDocument } from 'pdf-lib';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event?.body) throw new Error('No data was passed in the request body.');

        const bodyObj = JSON.parse(event.body);

        const { pdfTemplate } = bodyObj;

        if (!pdfTemplate) throw new Error('No pdfTemplate was passed in the request body.');

        const pdfBuffer = Buffer.from(pdfTemplate, 'base64');
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const formFields = pdfDoc.getForm().getFields();

        const formFieldsList = formFields.map((field) => encodeURIComponent(field.getName())).join(',');

        return {
            statusCode: 200,
            body: JSON.stringify({
                formFieldsList,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                err,
            }),
        };
    }
};
