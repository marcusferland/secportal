import React from 'react'
import Clipboard from 'clipboard'
import fs from 'fs'
import axios from 'axios'
import querystring from 'querystring'
import fileDownload from 'react-file-download'

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
  Tooltip,
  isBrowser,
  FormGroup,
  PanelBody,
  InputGroup,
  FormControl,
  PanelHeader,
  ButtonToolbar,
  OverlayTrigger,
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

  /**
   * Function to copy backup codes to clipboard
   *
   * @return {string} delimited by "\n"
   */
  copy(asdf = true) {
    const clipboard = new Clipboard('.copy-to-clipboard', {
      text: () => {
        return this.state.totps.join("\n")
      }
    })
  }

  /**
   *
   */
  download() {
    const data = this.state.totps.join("\n")
    return fileDownload(data, 'esentire-recovery-codes.txt')
  }

  print() {
    if ( isBrowser() ) window.print()
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
    const tooltip = (
      <Tooltip id='tooltip'>Copied!</Tooltip>
    )
    return (
      <div>
        <PanelContainer className='inbox' collapseBottom>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={12} style={{paddingBottom: 20}}>
                    <h1 style={{fontWeight: '100'}}>Two-factor recovery codes</h1>
                    <Icon glyph='icon-fontello-info-4' /> Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} style={{paddingBottom: 20}}>
                    <h4 style={{fontWeight: 700, marginTop: 40}}>Recovery Codes</h4>
                    <p>
                      Treat your recovery codes with the same level of attention as you would your password!
                      We recommend saving them with a password manager such as <a href="https://lastpass.com/" target="_blank">Lastpass</a>, <a href="https://1password.com/" target="_blank">1Password</a>, or <a href="https://keepersecurity.com/" target="_blank">Keeper</a>.
                    </p>
                    <Alert warning><strong><Icon glyph='icon-fontello-attention-3' /> Put these in a safe spot</strong>. If you lose your device and do not have the recovery codes you will lose access to your account.</Alert>
                    <TotpBackupList>{::this.generateRows()}</TotpBackupList>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} style={{paddingBottom: 20}}>
                    <ButtonToolbar>
                    	<Button outlined lg bsStyle='blue' onClick={::this.download}><Icon glyph='icon-fontello-download' /> Download</Button>
                    	<Button outlined lg bsStyle='blue' onClick={::this.print}><Icon glyph='icon-fontello-print' /> Print</Button>
                    	<OverlayTrigger placement='bottom' overlay={tooltip} trigger='click'>
                        <Button outlined lg bsStyle='blue' onClick={::this.copy} className='copy-to-clipboard'><Icon glyph='icon-fontello-docs-1' /> Copy</Button>
                      </OverlayTrigger>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} style={{paddingBottom: 20}}>
                    <h4 style={{fontWeight: 700, marginTop: 40}}>Generate new recovery codes</h4>
                    <p>When you generate new recovery codes, you must download or print the new codes. Your old codes won’t work anymore. This action is <b>not reversible</b>.</p>
                    <Button outlined lg bsStyle='blue' onClick={::this.print}><Icon glyph='icon-fontello-arrows-ccw' /> Generate new recovery codes</Button>
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
