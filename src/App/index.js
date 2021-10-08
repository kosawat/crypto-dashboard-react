import { Fragment } from 'react';
import styled, { css } from 'styled-components';

import './App.css';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import AppLayout from './AppLayout';
import AppBar from './AppBar';
import Content from '../Shared/Content';
import { AppProvider } from './AppProvider';

function App() {
  return ( <Fragment>
      <AppLayout>
        <AppProvider>
          <AppBar />
          <Content>
            <Settings />
            <Dashboard /> 
          </Content>
        </AppProvider>
      </AppLayout>
    </Fragment>
  );
}

export default App;
