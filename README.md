# ADA Hall - Ticketing System

Web and Mobile I project. A page where you can look at a theatre seat map, check a seat and its price, and add tickets to a cart.

Made with plain HTML, CSS and JavaScript.

## Plan

- Venue: the big hall in ADA University's C building (the seat layout and prices are my own, not the real ones)
- Week 1: layout sketch, sections and prices, HTML/CSS structure, venue data in JS
- Week 2: generate the seats from the data, seat states, seat details panel
- Week 3: zoom/move controls, cart, localStorage
- Week 4: responsive layout, testing and fixes, bonus (mouse wheel zoom + drag)

## Venue design

![Layout sketch](docs/sketch.jpg)

The stage is at the top. The closer to the stage, the more expensive the seat.

| Section     | Rows       | Seats per row | Price  |
|-------------|------------|---------------|--------|
| VIP         | A - C      | 16            | 60 AZN |
| Standard    | D - F      | 20            | 40 AZN |
| Economy     | G - M      | 20            | 30 AZN |
| Balcony     | N, P, Q    | 24            | 20 AZN |

- Like the real hall, every row has two aisles, so the seats are in three blocks: left, middle and right.
- Standard and Economy are one block of rows on the floor (like in my sketch): the first 3 rows are Standard, the rest is cheaper Economy.
- The real balcony goes around the hall (about 270°). I simplified it to a straight balcony at the back.
- Rows I and O are skipped (like in most theatres) so they do not get mixed up with 1 and 0.
- The balcony is upstairs, so on the map it is drawn separately at the back.
- Some seats are already sold / blocked and cannot be bought.
- Total: 300 seats.

## How to run

Just open `index.html` in a browser.