const { expect } = require("chai")

const NAME = "TicketBlock"
const SYMBOL = "TB"

const E_NAME = "Taylor Swift"
const E_COST = ethers.utils.parseUnits('1','ether')
const E_MAXTICKETS = 100
const E_DATE = "May 25"
const E_TIME = "20:00 CDMX"
const E_LOCATION = "Foro Sol, CDMX"

describe("TicketBlock", () => {

  let ticketBlock
  let creador, comprador

  beforeEach(async()=>{
      [creador, comprador] = await ethers.getSigners()

      const TicketBlock = await ethers.getContractFactory("TicketBlock")
      ticketBlock = await TicketBlock.deploy(NAME, SYMBOL)

      const transaction = await ticketBlock.connect(creador).list(
        E_NAME,
        E_COST,
        E_MAXTICKETS,
        E_DATE,
        E_TIME,
        E_LOCATION
      )
      await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await ticketBlock.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      expect(await ticketBlock.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () =>{
      expect(await ticketBlock.owner()).to.equal(creador.address)
    })

  })

  describe("Eventos",() =>{
    it('Update occasions count', async () =>{
      const totalEventos = await ticketBlock.totalEventos()
      expect(totalEventos).to.be.equal(1)
    })
    
    it('Returns occasions atributes', async() =>{
      const eventos = await ticketBlock.getEvento(1)
      expect(eventos.id).to.be.equal(1)
      expect(eventos.name).to.be.equal(E_NAME)
      expect(eventos.cost).to.be.equal(E_COST)
      expect(eventos.tickets).to.be.equal(E_MAXTICKETS)
      expect(eventos.date).to.be.equal(E_DATE)
      expect(eventos.time).to.be.equal(E_TIME)
      expect(eventos.location).to.be.equal(E_LOCATION)
    })

  })

  describe("Minting",() => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('1','ether')
    
    beforeEach(async()=>{
      const transaction = await ticketBlock.connect(comprador).mint(ID, SEAT, {value: AMOUNT})
      await transaction.wait()
    })

    it('Updates ticket count', async()=> {
      const eventos = await ticketBlock.getEvento(1)
      expect(eventos.tickets).to.be.equal(E_MAXTICKETS - 1)
    })

    it('Updates buying status', async()=> {
      const status = await ticketBlock.hasBought(ID,comprador.address)
      expect(status).to.be.equal(true)
    })

    it('Updates seat status', async() => {
      const owner = await ticketBlock.seatTaken(ID, SEAT)
      expect(owner).to.be.equal(comprador.address)
    })

    it('Updates overall seating status', async() => {
      const seats = await ticketBlock.getSeatsTaken(ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)
    })

    it('Updates the contract balance', async()=>{
      const balance = await ethers.provider.getBalance(ticketBlock.address)
      expect(balance).to.be.equal(AMOUNT)
    })

  })

  describe('Withdraw', ()=>{
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits("1",'ether')
    let balanceBefore

    beforeEach(async()=>{
      balanceBefore = await ethers.provider.getBalance(creador.address)

      let transaction = await ticketBlock.connect(comprador).mint(ID, SEAT, {value: AMOUNT})
      await transaction.wait()

      transaction = await ticketBlock.connect(creador).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async()=>{
      const balanceAfter = await ethers.provider.getBalance(creador.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async()=>{
      const balance = await ethers.provider.getBalance(ticketBlock.address)
      expect(balance).to.equal(0)
    })

  })

})
