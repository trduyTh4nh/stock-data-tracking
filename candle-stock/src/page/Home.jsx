import React, { useEffect, useState } from 'react';
import ChartPage from '../ChartPage';
// import axios from "axios"

// mai xử lý lỗi import axios bị lỗi  
// để khi m đổi cái interval với cái symbol thì nó dùng axios call api được
// nếu dùng được hoặc khó quá có thể dùng fetch
// giống như vầy như mà method post
// const response = await fetch(`http://localhost:7000/stockv2?symbol=${symbol}&interval=${interval}`, {
//   method: 'GET',
// });

import '../style/index.css'
import Stock from './components/Stock';
const HomePage = () => {

  const [symbol, setSymbol] = useState("btcusdt")
  const [interval, setInterval] = useState("1m")
  const [stock, setStock] = useState([])

  const handleChangeSymbol = (e) => {

    setSymbol(e.target.value)
    console.log("symbol when fetch: ", e.target.value)
    fetch("http://localhost:5000/update-symbol", {
      method: "POST",
      body: JSON.stringify({
        newSymbol: e.target.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("update symbol successfully!", data);
      })
      .catch((err) => {
        //  console.log("ERROR: ", err);
      });


  }

  const handleChangeInterval = (e) => {
    setInterval(e.target.value)
    fetch("http://localhost:5000/update-interval", {
      method: "POST",
      body: JSON.stringify({
        newInterval: e.target.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("update symbol successfully!", data);
      })
      .catch((err) => {
        //  console.log("ERROR: ", err);
      });

  }

  const isCheck = (time) => {
    return time === interval
  }

  const handleReceiveStock = (stockDataTen) => {

    setStock(stockDataTen.reverse())
    console.log(stock)
  }

  useEffect(() => {
    console.log(stock)
  }, [stock]);
  return (
    <div className='home'>
      <div className="wrap-home">
        <div className="wrap-home-top">

          <div className="wrap-home-top-top">
            <div className="wrap-home-top_left">
              <div className="wrap-home-top_left">
                <select className='select-stock' onChange={handleChangeSymbol}>
                  <option value="btcusdt">btcusdt</option>
                  <option value="ethusdt">ethusdt</option>
                </select>
              </div>
            </div>
            <div className="wrap-home-top_right">
              <div style={{
                display: "flex",
                alignItems: "center",

              }}>
                <input onChange={handleChangeInterval} style={{
                }} type="radio" name="stock" value="1m" checked={isCheck("1m")} id="stock-radio" />
                <p>1m</p>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",

              }}>
                <input onChange={handleChangeInterval} style={{
                }} type="radio" name="stock" value="15m" checked={isCheck("15m")} id="stock-radio" />
                <p>15m</p>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",

              }}>
                <input onChange={handleChangeInterval} style={{
                }} type="radio" name="stock" value="1h" checked={isCheck("1h")} id="stock-radio" />
                <p>1h</p>

              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
              }} >
                <input onChange={handleChangeInterval} type="radio" name="stock" checked={isCheck("1d")} value="1d" id="stock-radio" />
                <p>1d</p>
              </div>
            </div>

          </div>

          <div className="wrap-home-top-bottom">
              {

                stock ? stock.map((ItemStock) => (
                  <Stock 
                  ticket={ItemStock ? ItemStock.ticket : ""}
                  open={ItemStock ? ItemStock.open : ""}
                  high={ItemStock ? ItemStock.high : ""}
                  low={ItemStock ? ItemStock.low : ""}
                  close={ItemStock ? ItemStock.close : ""}
                  volume={ItemStock ? ItemStock.volume : ""}
                  timestamp={ItemStock ? ItemStock.timestamp : ""}
                  ></Stock>
                )) : <p>Loading...</p>
              }
          </div>

        </div>

        <div className="wrap-home-bottom">
          <ChartPage symbol={symbol} interval={interval} callBack={handleReceiveStock}>
          </ChartPage>
        </div>
      </div>
    </div>
  )
}




export default HomePage;
