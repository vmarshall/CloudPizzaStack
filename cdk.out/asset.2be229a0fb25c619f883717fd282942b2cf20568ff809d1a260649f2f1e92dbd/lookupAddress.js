"use strict";
exports.handler = async function (name = 'John Doe') {
    console.log("Retrieving Address :", JSON.stringify(name, undefined, 2));
    let customerAddress = '123 Fake Street';
    return { 'customerAddress': customerAddress };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9va3VwQWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvb2t1cEFkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxXQUFXLElBQUksR0FBRyxVQUFVO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsSUFBSSxlQUFlLEdBQUcsaUJBQWlCLENBQUE7SUFDdkMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxDQUFBO0FBQ2pELENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lID0gJ0pvaG4gRG9lJykge1xuICAgIGNvbnNvbGUubG9nKFwiUmV0cmlldmluZyBBZGRyZXNzIDpcIiwgSlNPTi5zdHJpbmdpZnkobmFtZSwgdW5kZWZpbmVkLCAyKSk7XG4gICAgbGV0IGN1c3RvbWVyQWRkcmVzcyA9ICcxMjMgRmFrZSBTdHJlZXQnXG4gICAgcmV0dXJuIHsgJ2N1c3RvbWVyQWRkcmVzcyc6IGN1c3RvbWVyQWRkcmVzcyB9XG59XG4iXX0=