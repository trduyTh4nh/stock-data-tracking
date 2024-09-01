import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page/Home';
import ChartPage from './ChartPage';
import './style/index.css';
import Layout from './page/Layout';
import OtherPage from './page/OtherPage';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/other" index element={<OtherPage />} /> 
                <Route path='/' index element={<HomePage />} /> 
            </Route>
        </Routes>
    </Router>
);

render(
    <App />,
    document.getElementById('root')
);
