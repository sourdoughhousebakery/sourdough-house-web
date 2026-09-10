# Shopify Product Details Design

## Goal

Make the product details column easier to scan and more professional across mugs, apparel, and products with many variants, while preserving the Sourdough House Bakery visual identity and Shopify's existing product behavior.

## Approved direction

- Use a 34–40px serif product title with a compact line height.
- Show the price directly below the title in a bold 20–22px sans-serif style.
- Separate the product identity from purchasing controls with a quiet divider.
- Use bold option labels and a medium-weight selected value.
- Show a compact Size guide link beside the Size label and open it in a modal only for products with a Size option.
- Keep color options as compact visual swatches and non-color options as equal, compact text buttons.
- Keep quantity compact and give the amber Add to cart button the strongest visual emphasis.
- Keep accelerated checkout directly beneath the primary action.
- Move the product description into an expandable Product details panel.
- Use tighter, consistent spacing and clear selected, hover, and focus states.

## Visual treatment

The details column uses a subtle warm-white panel with an espresso border and a soft shadow. The title retains the store's display serif, while prices, option labels, buttons, and accordion headings use the legible sans-serif family. Amber remains the primary purchase color; espresso is used for selected size states and readable text.

On smaller screens the panel loses the desktop card treatment and uses reduced spacing so the controls remain comfortable without narrowing the product content.

## Behavior and constraints

- Preserve Shopify's variant picker, availability handling, cart form, dynamic checkout, and media switching.
- Apply the redesign through the shared product template so current and future products inherit it.
- Do not invent size, shipping, returns, or fit information.
- Keep product-specific descriptions sourced from Shopify.
- Keep the size guide compact in the normal layout; the modal lists the product's available sizes and explains how to compare a similar garment without inventing manufacturer measurements.
- Develop and test on the unpublished `Sourdough House - design preview` theme.

## Validation

Verify one product with color, size, and logo-color options and one apparel product with many colors and sizes. Test option selection, price and media updates, Add to cart availability, the Product details accordion, keyboard focus, and responsive overflow.
