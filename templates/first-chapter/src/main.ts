import { mount } from 'svelte';
import App from './App.svelte';
import './styles/global.css';

const target = document.getElementById('app');
if (target === null) {
  throw new Error('Missing #app mount point in index.html');
}

export default mount(App, { target });
