import './index.css';
import * as reactDom from 'react-dom';
import MainLayout from './MainLayout';

var reactapp = document.createElement("div");
document.body.appendChild(reactapp);
reactDom.render(<MainLayout />, reactapp);
