import auth from "./auth";


describe("Auth ts not mocked", function () {
    describe("sign up bad email", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser", "secretPassword", "secretPassword", (success: true, error: "") => void{});
        });
    });
    describe("sign up short passes", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser@testuser.com", "secr", "secr", (success: true, error: "") => void{});
        });
    });
    describe("sign up not matching passes", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser@testuser.com", "secradad", "secr", (success: true, error: "") => void{});
        });
    });
    describe("send reset password email", function(){
        it ("Test use bad email.", function() {
               auth.sendResetPasswordEmail("testusercom", (success: true, error: "") => void{});
        });
    });
 });