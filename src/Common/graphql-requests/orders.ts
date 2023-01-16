export const checkoutWithTapMethod = `mutation tapCheckout($input: checkoutWithTapInput!) {
    checkoutWithTap(input: $input) {
      code
      message
      success
      redirectUrl
    }
  }`;

export const markOrderAsPaid = `mutation markOrderAsPaid($authId: String!) {
    markOrderAsPaid(authId: $authId) {
      code
      message
      success
      order {
        id
      }
    }
  }`;
