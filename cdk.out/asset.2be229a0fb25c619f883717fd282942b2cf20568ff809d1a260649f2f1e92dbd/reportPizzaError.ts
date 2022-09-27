exports.handler = async function (error: any) {
    console.log("Handle Pizza Error:", JSON.stringify(error, undefined, 2));
    console.log("Trigger Cloudwatch Alarm: ", JSON.stringify(error, undefined, 2));
    return { 'pizzaError': true }
}