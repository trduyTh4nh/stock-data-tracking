

import { tsvParse, csvParse, tsvFormat } from "d3-dsv";
import { timeParse } from "d3-time-format";
import _ from 'lodash';

// const parseDate = timeParse("%Y-%m-%d");

const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");
function parseData(parse) {
	return function (d) {
		var date = d.timestamp.split(' ')
		const dateTimeString = `${d.timestamp}`;
		return {
			// date: date[0] ? parse(date[0]) : null,
			date: parse(dateTimeString),
			open: d.open ? + d.open : NaN,
			high: d.high ? + d.high : NaN,
			low: d.low ? + d.low : NaN,
			close: d.close ? + d.close : NaN,
			volume: d.volume  ? + d.volume  : 20,
			ticket: d.type || ''
		};
	};
}


function jsonToTsv(jsonData) {
	return tsvFormat(jsonData);
}

export async function getData(symbol, interval) {
	try {
		// const symbol = 'btcusdt';
		// const interval = '1m';
		const response = await fetch(`http://localhost:7000/stockv2?symbol=${symbol}&interval=${interval}`, {
			method: 'GET',
		});

		const data = await response.json();
		const stockData = data.map(e => getInfoData({
			fields: ['timestamp', 'open', 'high', 'low', 'close', 'volume', 'type'],
			object: e
		}))

		// console.log("DATA FETCHED", stockData)
		const tsvData = jsonToTsv(stockData);
		// console.log('tsv data')
		// console.log(tsvData);

		// console.log(parseData(parseDateTime))

		return tsvParse(tsvData, parseData(parseDateTime));
	} catch (error) {
		console.error('Error fetching data:', error);
		return [getDefaultStockData()];
	}
	// const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
	// 	.then(response => response.text())
	// 	.then(data => tsvParse(data, parseData(parseDate)))
	// return promiseMSFT;
}


function getDefaultStockData() {
	return {
		date: '2024-08-27',
		open: 0,
		high: 0,
		low: 0,
		close: 0,
		vol: 0,
		type: 'DEFAULT'
	};
}

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};