import { ethers } from 'ethers';

const Card = ({ occasion, setOccasion, providers, tokenTix, account }) => {
  const buyTickets = async () => {
    const signer = await providers.getSigner();

    // Send the transaction to buy a seat
    const transaction = await tokenTix.connect(signer).mint(occasion.id, 1, { value: occasion.cost });
    await transaction.wait();

    // After the transaction is confirmed, fetch the updated seat count
    const updatedSeatCount = await tokenTix.getMovie(occasion.id).tickets;

    // Update the occasion object with the new seat count
    setOccasion({ ...occasion, tickets: updatedSeatCount });
  };

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{occasion.date}</strong><br />{occasion.time}
        </p>

        <h3 className='card__name'>
          {occasion.name}
        </h3>

        <p className='card__location'>
          <small>{occasion.location}</small>
        </p>

        <p className='card__cost'>
          <strong>
            {ethers.utils.formatUnits(occasion.cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        <p className='card__ticket'>
          <strong>
            {occasion.tickets.toString()}
          </strong>
          SEATS
        </p>

        {occasion.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button--out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => buyTickets()}
          >
            Buy Seats
          </button>
        )}
      </div>

    </div >
  );
}

export default Card;
