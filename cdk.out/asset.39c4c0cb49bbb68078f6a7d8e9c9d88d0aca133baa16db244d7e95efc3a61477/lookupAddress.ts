exports.handler = async function (name = 'John Doe') {
    console.log("Retrieving Address :", JSON.stringify(name, undefined, 2));
    let customerAddress = await getAddress(name)
    return { 'customeAddress': customerAddress }
}

function getAddress(name: string) {
    return { 'address': '123 Fake Street' }
}
