
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"
import io from 'socket.io-client';

import { TypeChooser } from "react-stockcharts/lib/helper";

const ChartPage = ({ symbol, interval, callBack }) => {

	const [data, setData] = useState([]);
	const [tenLastRecord, setTenLastRecord] = useState([])
	const socket = io('http://localhost:7000', {
		transports: ["websocket"],
	});

	// lỗi socket quá nhiều kết nối bên phía server
	useEffect(() => {
		const fetchData = async () => {
			const initialData = await getData(symbol, interval);
			if (initialData && initialData.length > 0) {
				console.log("initialData: ", initialData)
				setData(initialData);
				
				const arr = []
				for (let i = 10; i >= 0; i--) {
					if (i > 0) {
						arr.push(initialData[initialData.length - i])
					}
				}
				setTenLastRecord(arr)
				callBack(arr)
			} else {
				setData([])
			}
		};

		fetchData();

		socket.on('connect', () => {
			console.log('Connected to Socket.IO server with socket id:', socket.id);
		})

		socket.on('dataUpdate', (message) => {
			if (message.type == 'UPDATE_AVAILABLE') {
				console.log("Data update event received!")
				getData(symbol, interval).then(updatedData => {
					if (updatedData && updatedData.length > 0) {
						setData(updatedData);
						const arr = []
						for (let i = 10; i >= 0; i--) {
							if (i > 0) {
								arr.push(updatedData[updatedData.length - i])
							}
						}
						setTenLastRecord(arr)

						callBack(arr)


						console.log(updatedData)

					} else {
						console.error('Received empty or invalid data:', updatedData);
					}
				});
			}
		});


		socket.on('disconnect', () => {
			console.log("Disconnected from Socket server")
		})

		socket.on('error', (error) => {
			console.error('Socket.IO error', error)
		})

		return () => {
			socket.disconnect();
		};

	}, [symbol, interval])

	if (!data || data.length === 0) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<TypeChooser>
				{type => <Chart  type={type} data={data} />}
			</TypeChooser>
		</div>
	);
};

export default ChartPage;




// class ChartPage extends React.Component {
// 	componentDidMount() {
// 		getData().then(data => {
// 			this.setState({ data })
// 		})
// 	}
// 	render() {
// 		if (this.state == null) {
// 			return <div>Loading...</div>
// 		}
// 		return (
// 			<TypeChooser>
// 				{type => <Chart type={type} data={this.state.data} />}
// 			</TypeChooser>
// 		)
// 	}
// }

// export default ChartPage;