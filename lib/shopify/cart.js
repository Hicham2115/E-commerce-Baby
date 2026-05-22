import { storefrontMutate } from "@/lib/shopify/storefront";

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

function assertNoErrors(errors, fallback) {
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", ") || fallback);
  }
}

function mapCart(node) {
  const subtotal = parseFloat(node.cost.subtotalAmount.amount);
  const currencyCode = node.cost.subtotalAmount.currencyCode;

  const lines = node.lines.edges.map(({ node: line }) => {
    const m = line.merchandise;
    const optionLabel =
      m.selectedOptions.length > 0
        ? m.selectedOptions.map((o) => o.value).join(" · ")
        : m.title !== "Default Title"
          ? m.title
          : null;

    return {
      id: line.id,
      quantity: line.quantity,
      variantId: m.id,
      title: m.product.title,
      productTitle: m.product.title,
      handle: m.product.handle,
      imageUrl: m.image?.url ?? null,
      imageAlt: m.image?.altText ?? m.product.title,
      price: parseFloat(m.price.amount),
      currencyCode: m.price.currencyCode,
      optionLabel,
    };
  });

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    subtotal,
    currencyCode,
    lines,
  };
}

export async function createCart() {
  const data = await storefrontMutate(`
    mutation CartCreate {
      cartCreate {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `);

  assertNoErrors(data.cartCreate.userErrors, "Impossible de créer le panier");
  if (!data.cartCreate.cart) throw new Error("Panier non créé");
  return mapCart(data.cartCreate.cart);
}

export async function getCart(cartId) {
  const data = await storefrontMutate(
    `
      query Cart($id: ID!) {
        cart(id: $id) { ${CART_FIELDS} }
      }
    `,
    { id: cartId },
  );

  if (!data.cart) return null;
  return mapCart(data.cart);
}

export async function addToCart(cartId, lines) {
  const data = await storefrontMutate(
    `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    { cartId, lines },
  );

  assertNoErrors(data.cartLinesAdd.userErrors, "Impossible d'ajouter au panier");
  if (!data.cartLinesAdd.cart) throw new Error("Panier introuvable");
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await storefrontMutate(
    `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] },
  );

  assertNoErrors(
    data.cartLinesUpdate.userErrors,
    "Impossible de mettre à jour le panier",
  );
  if (!data.cartLinesUpdate.cart) throw new Error("Panier introuvable");
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId, lineIds) {
  const data = await storefrontMutate(
    `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    { cartId, lineIds },
  );

  assertNoErrors(
    data.cartLinesRemove.userErrors,
    "Impossible de retirer l'article",
  );
  if (!data.cartLinesRemove.cart) throw new Error("Panier introuvable");
  return mapCart(data.cartLinesRemove.cart);
}
