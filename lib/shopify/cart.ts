import { storefrontMutate } from "@/lib/shopify/storefront";

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  title: string;
  productTitle: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  currencyCode: string;
  optionLabel: string | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
  lines: CartLine[];
};

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

type CartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          selectedOptions: { name: string; value: string }[];
          product: { title: string; handle: string };
          image: { url: string; altText: string | null } | null;
        };
      };
    }[];
  };
};

type UserError = { field: string[] | null; message: string };

function assertNoErrors(errors: UserError[] | undefined, fallback: string) {
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", ") || fallback);
  }
}

function mapCart(node: CartNode): Cart {
  const subtotal = parseFloat(node.cost.subtotalAmount.amount);
  const currencyCode = node.cost.subtotalAmount.currencyCode;

  const lines: CartLine[] = node.lines.edges.map(({ node: line }) => {
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

export async function createCart(): Promise<Cart> {
  const data = await storefrontMutate<{
    cartCreate: { cart: CartNode | null; userErrors: UserError[] };
  }>(`
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

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontMutate<{ cart: CartNode | null }>(
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

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefrontMutate<{
    cartLinesAdd: { cart: CartNode | null; userErrors: UserError[] };
  }>(
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

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storefrontMutate<{
    cartLinesUpdate: { cart: CartNode | null; userErrors: UserError[] };
  }>(
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

export async function removeCartLine(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await storefrontMutate<{
    cartLinesRemove: { cart: CartNode | null; userErrors: UserError[] };
  }>(
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
