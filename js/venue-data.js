// Each section has its rows, how many seats are in each row and one price

const venue = {
  name: "ADA Hall",
  currency: "AZN",

  sections: [
    {
      id: "vip",
      name: "VIP",
      price: 60,
      color: "#c8962c",
      rows: ["A", "B", "C"],
      seatsPerRow: 16,
      aisles: [5, 11]
    },
    {
      id: "standard",
      name: "Standard",
      price: 40,
      color: "#2f6f9f",
      rows: ["D", "E"],
      seatsPerRow: 20,
      aisles: [6, 14]
    },
    {
      id: "economy",
      name: "Economy",
      price: 30,
      color: "#3c8d6e",
      rows: ["F", "G", "H", "J", "K", "L", "M"], // no "I", looks like 1
      seatsPerRow: 20,
      aisles: [6, 14],
      joinPrevious: true // same block as standard, just the back rows
    },
    {
      id: "balcony",
      name: "Balcony",
      price: 20,
      color: "#8a5aa8",
      rows: ["N", "P"], // back of the balcony, no "O" (looks like 0)
      seatsPerRow: 24,
      aisles: [7, 17],
      sides: { left: "BL", right: "BR", seats: 12 }
    }
  ],

  // seats that are already sold (seat id = row letter + number)
  unavailable: [
    "A6", "A7", "A8", "A9", "A10", "A11", "A14", "A15",
    "B1", "B4", "B5", "B7", "B8", "B9", "B10", "B16",
    "C6", "C7", "C12", "C13",
    "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14",
    "E9", "E10", "E11", "E12", "E19", "E20",
    "F1", "F2", "F9", "F10", "F11", "F12", "F19",
    "G8", "G9", "G15", "G16", "G17",
    "H5", "H6", "H7", "H14", "H15", "H20",
    "J5", "J6", "J10", "J11",
    "K1", "K2", "K3", "K19", "K20",
    "L9", "L10", "L11", "L12", "L13", "L14",
    "M1", "M8", "M9", "M10", "M11", "M12", "M20",
    "N1", "N2", "N3", "N10", "N11", "N12", "N13", "N20", "N21", "N22",
    "P1", "P2", "P12", "P13", "P23", "P24",
    "BL3", "BL4", "BL9", "BL10",
    "BR1", "BR2", "BR9", "BR10", "BR11", "BR12"
  ]
};