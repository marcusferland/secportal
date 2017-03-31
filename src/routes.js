import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */

import Sidebar from './common/sidebar';
import Header from './common/header';
import Footer from './common/footer';
import Auth from './common/auth'

/* Pages */

import Homepage from './routes/Homepage';

import Dashboard from './routes/Dashboard';

import Inbox from './routes/Inbox';
import Mail from './routes/Mail';
import Compose from './routes/Compose';

import Gallery from './routes/Gallery';

import Social from './routes/Social';

import Posts from './routes/Posts';
import Post from './routes/Post';

import Panels from './routes/Panels';

import LineSeries from './routes/LineSeries';
import AreaSeries from './routes/AreaSeries';
import BarColSeries from './routes/BarColSeries';
import MixedSeries from './routes/MixedSeries';
import PieDonutSeries from './routes/PieDonutSeries';

import Chartjs from './routes/Chartjs';
import C3js from './routes/C3js';
import Morrisjs from './routes/Morrisjs';

import StaticTimeline from './routes/StaticTimeline';
import InteractiveTimeline from './routes/InteractiveTimeline';

import Codemirrorjs from './routes/Codemirrorjs';
import Maps from './routes/Maps';
import Editor from './routes/Editor';

import Buttons from './routes/Buttons';
import Dropdowns from './routes/Dropdowns';
import TabsAndNavs from './routes/TabsAndNavs';
import Sliders from './routes/Sliders';
import Knobs from './routes/Knobs';
import Modals from './routes/Modals';
import Messengerjs from './routes/Messengerjs';

import Controls from './routes/Controls';
import XEditable from './routes/XEditable';
import Wizard from './routes/Wizard';

import Tables from './routes/Tables';
import Datatablesjs from './routes/Datatablesjs';
import Tablesawjs from './routes/Tablesawjs';

import Grids from './routes/Grids';
import Calendar from './routes/Calendar';

import Dropzonejs from './routes/Dropzonejs';
import Cropjs from './routes/Cropjs';

import Fonts from './routes/Fonts';

import Login from './routes/Login';
import Signup from './routes/Signup';
import Invoice from './routes/Invoice';
import Pricing from './routes/Pricing';

import Lock from './routes/Lock';

import Totp from './routes/Totp';

function requireAuth(nextState, replace) {
  if ( ! Auth.isUserAuthenticated() ) {
    replace({
      pathname: '/ltr/login'
    })
  }
}
function requireAuthTotp(nextState, replace) {
  if ( ! Auth.isUserAuthenticated('authed') ) {
    replace({
      pathname: '/ltr/login'
    })
  }
  if ( Auth.isUserAuthenticated('token') ) {
    replace({
      pathname: '/ltr/dashboard'
    })
  }
}
function isAuthed(nextState, replace) {
  if ( Auth.isUserAuthenticated('token') ) {
    replace({
      pathname: '/ltr/dashboard'
    })
  }
}

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
  <Route component={App}>
    <Route path='dashboard' component={Dashboard} onEnter={requireAuth} />
    <Route path='mailbox/inbox' component={Inbox} onEnter={requireAuth} />
    <Route path='mailbox/mail' component={Mail} onEnter={requireAuth} />
    <Route path='mailbox/compose' component={Compose} onEnter={requireAuth} />
    <Route path='gallery' component={Gallery} onEnter={requireAuth} />
    <Route path='social' component={Social} onEnter={requireAuth} />
    <Route path='blog/posts' component={Posts} onEnter={requireAuth} />
    <Route path='blog/post' component={Post} onEnter={requireAuth} />
    <Route path='panels' component={Panels} onEnter={requireAuth} />
    <Route path='charts/rubix/line' component={LineSeries} onEnter={requireAuth} />
    <Route path='charts/rubix/area' component={AreaSeries} onEnter={requireAuth} />
    <Route path='charts/rubix/barcol' component={BarColSeries} onEnter={requireAuth} />
    <Route path='charts/rubix/mixed' component={MixedSeries} onEnter={requireAuth} />
    <Route path='charts/rubix/piedonut' component={PieDonutSeries} onEnter={requireAuth} />
    <Route path='charts/chartjs' component={Chartjs} onEnter={requireAuth} />
    <Route path='charts/c3js' component={C3js} onEnter={requireAuth} />
    <Route path='charts/morrisjs' component={Morrisjs} onEnter={requireAuth} />
    <Route path='timeline' component={StaticTimeline} onEnter={requireAuth} />
    <Route path='interactive-timeline' component={InteractiveTimeline} onEnter={requireAuth} />
    <Route path='codemirror' component={Codemirrorjs} onEnter={requireAuth} />
    <Route path='maps' component={Maps} onEnter={requireAuth} />
    <Route path='editor' component={Editor} onEnter={requireAuth} />
    <Route path='ui-elements/buttons' component={Buttons} onEnter={requireAuth} />
    <Route path='ui-elements/dropdowns' component={Dropdowns} onEnter={requireAuth} />
    <Route path='ui-elements/tabs-and-navs' component={TabsAndNavs} onEnter={requireAuth} />
    <Route path='ui-elements/sliders' component={Sliders} onEnter={requireAuth} />
    <Route path='ui-elements/knobs' component={Knobs} onEnter={requireAuth} />
    <Route path='ui-elements/modals' component={Modals} onEnter={requireAuth} />
    <Route path='ui-elements/messenger' component={Messengerjs} onEnter={requireAuth} />
    <Route path='forms/controls' component={Controls} onEnter={requireAuth} />
    <Route path='forms/x-editable' component={XEditable} onEnter={requireAuth} />
    <Route path='forms/wizard' component={Wizard} onEnter={requireAuth} />
    <Route path='tables/bootstrap-tables' component={Tables} onEnter={requireAuth} />
    <Route path='tables/datatables' component={Datatablesjs} onEnter={requireAuth} />
    <Route path='tables/tablesaw' component={Tablesawjs} onEnter={requireAuth} />
    <Route path='grid' component={Grids} onEnter={requireAuth} />
    <Route path='calendar' component={Calendar} onEnter={requireAuth} />
    <Route path='file-utilities/dropzone' component={Dropzonejs} onEnter={requireAuth} />
    <Route path='file-utilities/crop' component={Cropjs} onEnter={requireAuth} />
    <Route path='fonts' component={Fonts} onEnter={requireAuth} />
    <Route path='invoice' component={Invoice} onEnter={requireAuth} />
    <Route path='pricing' component={Pricing} onEnter={requireAuth} />
  </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
  <Route>
    <Route path='lock' component={Lock} />
    <Route path='totp' component={Totp} onEnter={requireAuthTotp} />
    <Route path='login' component={Login} onEnter={isAuthed} />
    <Route path='signup' component={Signup} onEnter={isAuthed} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
);

export default (
  <Route>
    <Route path='/' component={Homepage} />

    <Route path='/ltr'>
      {combinedRoutes}
    </Route>
    <Route path='/rtl'>
      {combinedRoutes}
    </Route>
  </Route>
);
