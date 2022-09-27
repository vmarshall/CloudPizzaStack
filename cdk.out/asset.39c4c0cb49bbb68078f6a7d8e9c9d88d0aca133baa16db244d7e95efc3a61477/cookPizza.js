"use strict";
function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s; }
exports.handler = async function (flavour, name = 'John Doe') {
    console.log("Cooking Pizza :", JSON.stringify(flavour, undefined, 2));
    let randTime = Math.random() * 600;
    let timeElapsed = fmtMSS(randTime);
    return { 'timeReady': timeElapsed };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va1BpenphLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29va1BpenphLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLE1BQU0sQ0FBQyxDQUFTLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVyRixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssV0FBVyxPQUFZLEVBQUUsSUFBSSxHQUFHLFVBQVU7SUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ25DLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFBO0FBQ3ZDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGZtdE1TUyhzOiBudW1iZXIpIHsgcmV0dXJuIChzIC0gKHMgJT0gNjApKSAvIDYwICsgKDkgPCBzID8gJzonIDogJzowJykgKyBzIH1cblxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgZnVuY3Rpb24gKGZsYXZvdXI6IGFueSwgbmFtZSA9ICdKb2huIERvZScpIHtcbiAgICBjb25zb2xlLmxvZyhcIkNvb2tpbmcgUGl6emEgOlwiLCBKU09OLnN0cmluZ2lmeShmbGF2b3VyLCB1bmRlZmluZWQsIDIpKTtcblxuICAgIGxldCByYW5kVGltZSA9IE1hdGgucmFuZG9tKCkgKiA2MDA7XG4gICAgbGV0IHRpbWVFbGFwc2VkID0gZm10TVNTKHJhbmRUaW1lKTtcblxuICAgIHJldHVybiB7ICd0aW1lUmVhZHknOiB0aW1lRWxhcHNlZCB9XG59Il19