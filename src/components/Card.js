import { ethers } from 'ethers'

const Card = ({ evento, toggle, setToggle, setEvento }) => {
  const togglePop = () => {
    setEvento(evento)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{evento.date}</strong><br />{evento.time}
        </p>

        <h3 className='card__name'>
          {evento.name}
        </h3>

        <p className='card__location'>
          <small>{evento.location}</small>
        </p>

        <p className='card__cost'>
          <strong>
            {ethers.utils.formatUnits(evento.cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        {evento.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button--out'
            disabled
          >
            Agotado
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => togglePop()}
          >
            Ver asientos
          </button>
        )}
      </div>

      <hr />
    </div >
  );
}

export default Card;