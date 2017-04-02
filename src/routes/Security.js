import React from 'react'

import Auth from '../common/auth'

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Alert,
  Panel,
  Table,
  Button,
  isBrowser,
  FormGroup,
  PanelBody,
  InputGroup,
  FormControl,
  PanelHeader,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix'

class TotpBackupList extends React.Component {
  render() {
    return (
      <ul className='two-factor-recovery-codes'>
        {this.props.children}
      </ul>
    )
  }
}

export default class Security extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totps: Auth.getUserBackupTotp()
    }
  }

  print() {
    if (isBrowser()) {
      window.print();
    }
  }

  convertObjToArr() {
    const obj = this.state.totps
    return Object.keys(obj).map(key => obj[key])
  }

  generateRows() {
    const cols = 4
    const totps = this.convertObjToArr()
    const arr = []
    let counter = 1

    return totps.map((totp) => {
      return <li key={counter++} className='two-factor-recovery-code'>{totp}</li>
    })
  }

  render() {
    return (
      <div>
        <PanelContainer className='inbox' collapseBottom>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                    <h1 style={{fontWeight: '100'}}>Two-factor recovery codes</h1>
                    <Icon glyph='icon-fontello-info-4' /> Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.
                    <h4 style={{fontWeight: 700, marginTop: 40}}>Recovery Codes</h4>
                    <p>
                      Treat your recovery codes with the same level of attention as you would your password!
                      We recommend saving them with a password manager such as <a href="https://lastpass.com/" target="_blank">Lastpass</a>, <a href="https://1password.com/" target="_blank">1Password</a>, or <a href="https://keepersecurity.com/" target="_blank">Keeper</a>.
                    </p>
                    <Alert warning><strong><Icon glyph='icon-fontello-attention-3' /> Put these in a safe spot</strong>. If you lose your device and do not have the recovery codes you will lose access to your account.</Alert>
                    <TotpBackupList>{::this.generateRows()}</TotpBackupList>
                    <ButtonToolbar>
                    	<Button outlined lg bsStyle='blue'><Icon glyph='icon-fontello-download' /> Download</Button>
                    	<Button outlined lg bsStyle='blue' onClick={::this.print}><Icon glyph='icon-fontello-print' /> Print</Button>
                    	<Button outlined lg bsStyle='blue'><Icon glyph='icon-fontello-docs-1' /> Copy</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    )
  }
}
