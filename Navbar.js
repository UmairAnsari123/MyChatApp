import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <nav>
            <div className='left'>
              <div></div>
                <Link to='/login'><button>Login</button></Link> 
                <Link to='/signup'><button>Signup</button></Link>  
                <Link to='/login'><button>Login</button></Link>          
            </div> 

        </nav>

    </div>
  )
}

export default Navbar