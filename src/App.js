import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Card from './components/Card'

// ABIs
import TokenTixA from './abis/TokenTix.json';

// Config
import config from './config.json';

function App() {

  
  const [account, setAccount] = useState(null); 
  const [occasions, setOccasions] = useState([]); 
  const [occasion, setOccasion] = useState({});
  const [provider, setProvider] = useState(null);
  const [TokenTix, setTokenTix] = useState(null);

  
  // // get metamask acc that is connected 
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork();
    const TokenTix = new ethers.Contract(config[network.chainId].Tokentix.address, TokenTixA.abi, provider );
    setTokenTix(TokenTix);
    
    // getting movies from contract
    const occasions = [];
    for (var i = 1; i <= 5; i++) {
      const movie = await TokenTix.getMovie(i);
      occasions.push(movie);
    }
    // set to app
    setOccasions(occasions);

    console.log(occasions);

    // refresh acccounts
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account1 = ethers.utils.getAddress(accounts[0]);
      setAccount(account1);
    })
  }
  
  

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
      </header>

      <div className='cards'>
      {occasions.map((occasion, index) => (
          <Card
          occasion={occasion}
          id={index + 1}
          tokenTix={TokenTix} // Pass the tokenTix object
          provider={provider}
          account={account}
          setOccasion={setOccasion}
          key={index}
          providers={provider}
        />
        
        ))}
      </div>

    

    </div>
  )
}

export default App;