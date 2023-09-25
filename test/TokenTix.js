const { expect } = require('chai');

describe('TokenTix', function () {
  let TokenTix;
  let tokenTix;
  let deployer, buyer;

  before(async function () {
    // accounts
    [deployer, buyer] = await ethers.getSigners();

    TokenTix = await ethers.getContractFactory('TokenTix');
    tokenTix = await TokenTix.deploy('TokenTix', 'TTX');

    // deployer is signing the transaction when calling this function
    const transaction = await tokenTix.connect(deployer).list(
      'jawaan', 
       ethers.utils.parseUnits('1', 'ether'),
       100,
       'September 20th',
       '10:00 AM',
       'jorhat'
    );
    
    await tokenTix.deployed();
    await transaction.wait();
  });

  describe("Deployment", () => {
    it('Should set the correct name', async function () {
      expect(await tokenTix.name()).to.equal('TokenTix');
    });

    it('Should set the correct symbol', async function () {
      expect(await tokenTix.symbol()).to.equal('TTX');
    });

    it("Should set the owner", async function () {
      expect(await tokenTix.owner()).to.equal(deployer.address);
    });

  })

  describe("Movies", () => {

    it('should update the movie count', async function () {
      const movieCount = await tokenTix.moviesCount();
      expect(movieCount).to.equal(1);
    });





  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const  AMOUNT = ethers.utils.parseUnits("1", 'ether');

    beforeEach(async () => {
      const transaction = await tokenTix.connect(buyer).mint(
       ID,
       SEAT,
       {value: AMOUNT} //function meta data as it is payable function
      );
      await transaction.wait();
    });

    it('Updates the ticket count', async function () {
      const movie = await tokenTix.getMovie(1);
      expect(movie.tickets).to.be.equal(99);
    })

    it('Updates buying status', async () => {
      const status = await tokenTix.hasBought(ID, buyer.address)
      expect(status).to.be.equal(true)
    })

    it('Updates seat status', async () => {
      const owner = await tokenTix.seatTrx(ID, SEAT)
      expect(owner).to.equal(buyer.address)
    })

  });

  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", 'ether');
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await tokenTix.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();

      transaction = await tokenTix.connect(deployer).withdraw();
      await transaction.wait();
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })
  })


});
