import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuraModeShop from "./aura-mode-shop.jsx";

function getCartDrawer() {
  return screen.getByTestId("cart-drawer");
}

function getCartLines() {
  return within(getCartDrawer()).getByTestId("cart-lines");
}

function getCartSubtotal() {
  return within(getCartDrawer()).getByTestId("cart-subtotal");
}

function getAddToCartButtons() {
  // Grid order matches PRODUCTS order: Aura Ring, Kiro Necklace, Nami Hoops, Sora Bracelet, Yuki Cuff.
  return screen.getAllByRole("button", { name: "In den Warenkorb" });
}

function getCartCountBadge() {
  return within(screen.getByRole("button", { name: "Warenkorb öffnen" })).queryByText(/^\d+$/);
}

describe("cart", () => {
  it("starts empty with no header badge and an empty-cart message", () => {
    render(<AuraModeShop />);

    expect(getCartCountBadge()).not.toBeInTheDocument();
    expect(within(getCartDrawer()).getByText("Dein Warenkorb ist noch leer.")).toBeInTheDocument();
  });

  it("adds a product to the cart and reflects it in the header and drawer", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    await user.click(getAddToCartButtons()[0]); // Aura Ring, 68 €

    expect(getCartCountBadge()).toHaveTextContent("1");

    expect(within(getCartDrawer()).getByText("Warenkorb (1)")).toBeInTheDocument();
    expect(within(getCartLines()).getByText("Aura Ring")).toBeInTheDocument();
    expect(within(getCartLines()).getByText("68,00 €")).toBeInTheDocument();
    expect(getCartSubtotal()).toHaveTextContent("68,00 €");
  });

  it("merges a second add-to-cart of the same product/material into one line instead of duplicating it", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    const addButtons = getAddToCartButtons();
    await user.click(addButtons[0]); // Aura Ring
    await user.click(addButtons[0]); // Aura Ring again, same default material

    expect(getCartCountBadge()).toHaveTextContent("2");

    expect(within(getCartDrawer()).getByText("Warenkorb (2)")).toBeInTheDocument();
    const lines = getCartLines();
    expect(within(lines).getAllByText("Aura Ring")).toHaveLength(1);
    expect(within(lines).getByText("136,00 €")).toBeInTheDocument(); // 68 € × 2
    expect(getCartSubtotal()).toHaveTextContent("136,00 €");
  });

  it("keeps separate products as separate lines", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    const addButtons = getAddToCartButtons();
    await user.click(addButtons[0]); // Aura Ring, 68 €
    await user.click(addButtons[4]); // Yuki Cuff, 96 €

    expect(getCartCountBadge()).toHaveTextContent("2");

    expect(within(getCartDrawer()).getByText("Warenkorb (2)")).toBeInTheDocument();
    const lines = getCartLines();
    expect(within(lines).getByText("Aura Ring")).toBeInTheDocument();
    expect(within(lines).getByText("Yuki Cuff")).toBeInTheDocument();
    expect(getCartSubtotal()).toHaveTextContent("164,00 €"); // 68 + 96
  });

  it("increments and decrements a line's quantity via the stepper", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    await user.click(getAddToCartButtons()[0]); // Aura Ring, qty 1

    const lines = getCartLines();
    await user.click(within(lines).getByRole("button", { name: "Menge erhöhen" }));

    expect(within(getCartDrawer()).getByText("Warenkorb (2)")).toBeInTheDocument();
    expect(within(lines).getByText("136,00 €")).toBeInTheDocument();
    expect(getCartSubtotal()).toHaveTextContent("136,00 €");

    await user.click(within(lines).getByRole("button", { name: "Menge verringern" }));

    expect(within(getCartDrawer()).getByText("Warenkorb (1)")).toBeInTheDocument();
    expect(within(lines).getByText("68,00 €")).toBeInTheDocument();
    expect(getCartSubtotal()).toHaveTextContent("68,00 €");
  });

  it("removes the line once quantity is decremented to zero", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    await user.click(getAddToCartButtons()[0]); // Aura Ring, qty 1

    const lines = getCartLines();
    await user.click(within(lines).getByRole("button", { name: "Menge verringern" }));

    expect(getCartCountBadge()).not.toBeInTheDocument();
    expect(within(getCartDrawer()).getByText("Dein Warenkorb ist noch leer.")).toBeInTheDocument();
    expect(
      within(getCartDrawer()).queryByRole("button", { name: "Aura Ring entfernen" })
    ).not.toBeInTheDocument();
  });

  it("removes a line directly via its 'Entfernen' button, leaving other lines intact", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    const addButtons = getAddToCartButtons();
    await user.click(addButtons[0]); // Aura Ring
    await user.click(addButtons[4]); // Yuki Cuff

    const lines = getCartLines();
    await user.click(within(lines).getByRole("button", { name: "Aura Ring entfernen" }));

    expect(getCartCountBadge()).toHaveTextContent("1");
    expect(within(getCartLines()).queryByText("Aura Ring")).not.toBeInTheDocument();
    expect(within(getCartLines()).getByText("Yuki Cuff")).toBeInTheDocument();
  });
});

describe("free shipping progress", () => {
  it("shows the full amount remaining when the cart is empty", () => {
    render(<AuraModeShop />);

    const drawer = within(getCartDrawer());
    expect(drawer.getByText(/Noch/).textContent).toContain("150,00 €");
    expect(drawer.queryByText("Gratis Versand freigeschaltet ✓")).not.toBeInTheDocument();
  });

  it("reduces the remaining amount as items are added, below the goal", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    await user.click(getAddToCartButtons()[0]); // Aura Ring, 68 €

    const drawer = within(getCartDrawer());
    // remaining = 150 - 68 = 82
    expect(drawer.getByText(/Noch/).textContent).toContain("82,00 €");
    expect(drawer.queryByText("Gratis Versand freigeschaltet ✓")).not.toBeInTheDocument();
  });

  it("unlocks free shipping once the subtotal reaches the goal", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    const addButtons = getAddToCartButtons();
    await user.click(addButtons[0]); // Aura Ring, 68 €
    await user.click(addButtons[4]); // Yuki Cuff, 96 € -> subtotal 164 >= 150

    const drawer = within(getCartDrawer());
    expect(drawer.getByText("Gratis Versand freigeschaltet ✓")).toBeInTheDocument();
    expect(drawer.queryByText(/bis zum/)).not.toBeInTheDocument();
  });

  it("scales the progress bar width proportionally to the goal, capped at 100%", async () => {
    const user = userEvent.setup();
    render(<AuraModeShop />);

    const drawer = within(getCartDrawer());
    const addButtons = getAddToCartButtons();

    await user.click(addButtons[0]); // Aura Ring, 68 € -> 68/150 = 45.333...%
    expect(drawer.getByTestId("free-shipping-progress")).toHaveStyle({
      width: `${(68 / 150) * 100}%`,
    });

    await user.click(addButtons[4]); // + Yuki Cuff, 96 € -> subtotal 164 >= 150
    expect(drawer.getByTestId("free-shipping-progress")).toHaveStyle({ width: "100%" });
  });
});
