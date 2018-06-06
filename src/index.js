import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router/index';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
