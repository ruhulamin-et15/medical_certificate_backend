export const paymentSearchFilter = (search: string) => {
  if (!search) return {};

  return {
    OR: [
      {
        orderId: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        productName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        customerDetails: {
          path: ["name"],
          string_contains: search,
          mode: "insensitive",
        },
      },
      {
        customerDetails: {
          path: ["email"],
          string_contains: search,
          mode: "insensitive",
        },
      },
    ],
  };
};
