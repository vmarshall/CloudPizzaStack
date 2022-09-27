exports.handler = async function (name = 'John Doe') {
    console.log("Retrieving Address :", JSON.stringify(name, undefined, 2));
    let customerAddress = '123 Fake Street'
    return { 'customerAddress': customerAddress }
}
