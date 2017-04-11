import React from 'react'

import {
  Row,
  Col,
  Grid,
  Icon,
  Label,
  Sidebar,
  Progress,
  SidebarNav,
  FormControl,
  SidebarNavItem
} from '@sketchpixy/rubix'

import { Link, withRouter } from 'react-router'

import Auth from './auth'

@withRouter
class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }

  handleLogout(e) {
    Auth.deauthenticateUser()
    this.props.router.push('/');
  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <FormControl type='text' placeholder='Search...' onChange={::this.handleChange} className='sidebar-search' style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>

                  { /** Pages Section */ }
                  <div className='sidebar-header'>PAGES</div>

                  <SidebarNavItem glyph='icon-fontello-gauge' name='Dashboard' href={::this.getPath('dashboard')} />
                  <SidebarNavItem glyph='icon-fontello-doc-text-inv' name='Reports' href={::this.getPath('reports')} />
                  <SidebarNavItem glyph='icon-fontello-user-1' name='Profile' href={::this.getPath('social')} />
                  <SidebarNavItem glyph='icon-fontello-cog-1' name={<span>Settings <Label className='bg-darkgreen45 fg-white'>1</Label></span>}>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-lock' name='Security' href={::this.getPath('settings/security')} />
                    </SidebarNav>
                  </SidebarNavItem>
                  <SidebarNavItem glyph='icon-fontello-logout-1' name='Logout' href='#' onClick={::this.handleLogout} />

                </SidebarNav>
                <br />
                <br />
                <br />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

@withRouter
export default class SidebarContainer extends React.Component {
  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    const imgStyle = {
      borderRadius: "25px"
    }
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img style={imgStyle} src='/imgs/app/avatars/marc-ferland.jpg' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>Marc Ferland</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                  <Link to={::this.getPath('lock')}>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </Link>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <div id='sidebar-container' style={{top:'80px'}}>
          <Sidebar sidebar={0}>
            <ApplicationSidebar />
          </Sidebar>
        </div>
      </div>
    );
  }
}
