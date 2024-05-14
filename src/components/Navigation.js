import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>TicketBlock</h1>

        <input className='nav__search' type="text" placeholder='Buscar eventos' />

        <ul className='nav__links'>
          <li><a href="/">Conciertos</a></li>
          <li><a href="/">Deportes</a></li>
          <li><a href="/">Arte y teatro</a></li>
          <li><a href="/">Mas</a></li>
        </ul>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Conectar
        </button>
      )}
    </nav>
  );
}

export default Navigation;