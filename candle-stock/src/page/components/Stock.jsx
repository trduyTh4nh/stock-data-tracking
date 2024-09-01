
import React from "react"

const arrIcon = [
    "https://s2.coinmarketcap.com/static/img/coins/200x200/1.png",
    "https://info-size.integral.link/static/media/eth.5fc0c9bd.png"
]

const Stock = ({
    ticket,
    timestamp,
    open,
    high,
    close,
    low,
    volume
}) => {
    return <div className="stock">
        <div className="wrap-stock">
            <div className="stock-top" style={{
                display: "flex",
                alignItems: "center",
                gap: 10
            }}>
                <div>{ticket}</div>
                <img width={30}
                    height={30}
                    src={ticket === "btcusdt" ? arrIcon[0] : arrIcon[1]} alt="" />
            </div>

            <div className="stock-bottom">
                <div style={{
                    fontWeight: "bold"
                }}>Open: {open}</div>
                <div style={{
                    fontWeight: "bold"
                }}>High: {high}</div>
                <div style={{
                    fontWeight: "bold"
                }}>Low: {low}</div>
                <div style={{
                    fontWeight: "bold"
                }}>Close: {close}</div>
                <div style={{
                    fontWeight: "bold"
                }}>Volume: {volume}</div>
            </div>

            <div className="stock-time">
                <span>{timestamp}</span>
            </div>
        </div>
    </div>
}

export default Stock