const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [creador] = await ethers.getSigners()
  const NAME = "TicketBlock"
  const SYMBOL = "TB"

  // Deploy contract
  const TicketBlock = await ethers.getContractFactory("TicketBlock")
  const ticketBlock = await TicketBlock.deploy(NAME, SYMBOL)
  await ticketBlock.deployed()

  console.log(`Deployed TokenMaster Contract at: ${ticketBlock.address}\n`)

  // List 6 events
  const eventos = [
    {
      name: "Taylor Swift",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM CDMX",
      location: "FORO SOL, CDMX"
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan"
    }
  ]

  for (var i = 0; i < 2; i++) {
    const transaction = await ticketBlock.connect(creador).list(
      eventos[i].name,
      eventos[i].cost,
      eventos[i].tickets,
      eventos[i].date,
      eventos[i].time,
      eventos[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${eventos[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});