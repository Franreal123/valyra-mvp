import { test, expect } from "@playwright/test";

// The end-to-end thesis: one home flows through all three roles via a single
// shared (client-side) store. We MUST navigate in-app (clicking links/tabs) and
// never reload — a full page load reinstantiates the module and resets the store.
test("home is signed by its owner, funded by an investor, then settled at the desk", async ({
  page,
}) => {
  const ADDRESS = "Proefstraat 7";

  // --- 1. Homeowner: apply → valuation → offer → sign ----------------------
  await page.goto("/homeowner");

  await page.getByLabel("Address").fill(ADDRESS);
  await page.getByLabel("City").selectOption("Utrecht");
  await page.getByLabel("Floor area (m²)").fill("85");
  // No mortgage → full unmortgaged equity, so a 10% share is always eligible.
  await page.getByLabel("Outstanding mortgage (€)").fill("0");

  await page.getByRole("button", { name: /Get my valuation/ }).click();
  await expect(page.getByText("Estimated value")).toBeVisible();

  await page.getByRole("button", { name: /See my offer/ }).click();
  await expect(page.getByText("Cash to you today")).toBeVisible();

  await page.getByRole("button", { name: /Sign agreement/ }).click();
  await expect(page.getByText("Agreement signed")).toBeVisible();

  // --- 2. Investor: the freshly signed home appears in the marketplace ------
  // Scope nav to the header — the footer repeats these links.
  await page.locator("header").getByRole("link", { name: "Investors" }).click();
  await expect(
    page.getByRole("button", { name: `Invest in ${ADDRESS}` }),
  ).toBeVisible();
  await page.getByRole("button", { name: `Invest in ${ADDRESS}` }).click();

  // KYC / suitability gate (required before a first purchase).
  const kyc = page.getByRole("dialog");
  await expect(kyc.getByText("Verify to invest")).toBeVisible();
  await kyc.getByLabel("Full name").fill("Test Investor");
  await kyc.getByLabel("Year of birth").fill("1990");
  await kyc.getByLabel("Investment experience").selectOption("Some");
  await kyc.getByLabel("I can bear the loss of my entire investment.").check();
  await kyc
    .getByLabel(
      "I understand these tokens are illiquid, long-dated, and can fall in value.",
    )
    .check();
  await kyc.getByRole("button", { name: "Complete verification" }).click();

  // Buy panel opens for the same home; confirm the default amount.
  const buy = page.getByRole("dialog");
  await expect(
    buy.getByRole("heading", { name: `Invest in ${ADDRESS}` }),
  ).toBeVisible();
  await buy.getByRole("button", { name: "Confirm purchase" }).click();

  // Lands on the portfolio with the new position.
  await expect(page.getByRole("tab", { name: "Portfolio" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByText(ADDRESS, { exact: true })).toBeVisible();

  // --- 3. Desk: the same home is settleable, then shows as settled ----------
  await page.locator("header").getByRole("link", { name: "Desk" }).click();
  const row = page.getByRole("row", { name: new RegExp(ADDRESS) });
  await expect(row).toBeVisible();

  await page.getByRole("button", { name: `Settle ${ADDRESS}` }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm settlement" })
    .click();

  await expect(row.getByText("Settled")).toBeVisible();
});
