import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='main'>
      <div className='sidebar' style={{
       
      }}>
        <div style={{
          display: "flex",
          gap: 20,
        }}>
          {/* <div style={{
            color: "#000",
            fontWeight: "bold",
            fontSize: 16
          }}>
            <Link to="/">Home</Link>
          </div> */}
          {/* <div style={{
            color: "#000",
            fontWeight: "bold",
            fontSize: 16
          }}>
            <Link to="/other">other page</Link>
          </div> */}

        </div>
      </div>

      <div className='body' style={{
        padding: 20
      }}>
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;
