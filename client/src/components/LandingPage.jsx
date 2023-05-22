import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Connector</h1>
          <p className='lead'>
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className='buttons'>
            <Link to='/register'>
              <div className='btn btn-primary'>Sign Up</div>
            </Link>
            <Link to='/login'>
              <div className='btn btn-light'>Login</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
