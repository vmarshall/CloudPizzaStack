function fmtMSS(s: number) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

exports.handler = async function (flavour: any, name = 'John Doe') {
    console.log("Cooking Pizza :", JSON.stringify(flavour, undefined, 2));

    let randTime = Math.random() * 600;
    let timeElapsed = fmtMSS(randTime);

    return { 'timeReady': timeElapsed }
}