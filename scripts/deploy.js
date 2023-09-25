const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "TokenTix"
  const SYMBOL = "TTX"

  // Deploy contract
  const TokenTix = await ethers.getContractFactory("TokenTix")
  const tokenTix = await TokenTix.deploy(NAME, SYMBOL)
  await tokenTix.deployed()

  console.log(`Deployed TokenTix Contract at: ${tokenTix.address}\n`)

  // List 6 events
  const movies = [
    {
      name: "KGF",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM",
      location: "Tinsukia"
    },
    {
      name: "Bahubali",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM",
      location: "Nagaon"
    },
    {
      name: "Bajrangi Bhaijan",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM",
      location: "Sivsagar"
    },
    {
      name: "Sultan",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM",
      location: "Jorhat"
    },
    {
      name: "Jawan",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM",
      location: "Dibrugarh"
    }
  ]

  for (var i = 0; i < 5; i++) {
    const transaction = await tokenTix.connect(deployer).list(
      movies[i].name,
      movies[i].cost,
      movies[i].tickets,
      movies[i].date,
      movies[i].time,
      movies[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${movies[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});