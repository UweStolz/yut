import 'dotenv/config';
import './setEnvironment';
import './electron/main';
import createScreen from './terminal';

createScreen();
