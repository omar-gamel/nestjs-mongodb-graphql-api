export const VERIFY_USER = `mutation verifyUser(
$token: String!
$email: String!
) {
  response:verifyUser(token:$token,email:$email) {
    code
    message
    success
  }
}`;
