import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TicketBlock from './abis/TicketBlock.json'

// Config
import config from './config.json'

function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [ticketBlock, setTicketBlock] = useState(null)
  const [eventos, setEventos] = useState([])
  const [evento, setEvento] = useState({})
  const [toggle, setToggle] = useState(null)

  const loadBlockchainData = async() =>{

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const address = config[network.chainId].TicketBlock.address
    const ticketBlock = new ethers.Contract(address,TicketBlock,provider)
    setTicketBlock(ticketBlock)

    const totalEventos = await ticketBlock.totalEventos()
    const eventos = []

    for(var i=1 ; i<=totalEventos; i++){
      const evento = await ticketBlock.getEvento(i)
      eventos.push(evento)
    }

    setEventos(eventos)

    console.log(eventos)
    
    window.ethereum.on('accountsChanged', async()=>{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

  }
  
  useEffect(()=>{
    loadBlockchainData();
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount}/>
        <h2 className='header__title'>Tu entrada a la mejor experiencia</h2>
      </header>

      <div className='cards'>
        {eventos.map((evento,index)=>(
          <Card
            evento = {evento}
            id = {index + 1}
            ticketBlock = {ticketBlock}
            provider = {provider}
            account = {account}
            toggle = {toggle}
            setToggle = {setToggle}
            setEvento = {setEvento}
            key = {index}
          />
        ))}
      </div> 

        {toggle && (
          <SeatChart
            evento={evento}
            ticketBlock={ticketBlock}
            provider={provider}
            setToggle={setToggle}
          />
        )}

    </div>
  );
}

export default App;