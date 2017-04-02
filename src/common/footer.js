import React from 'react'

import {
  Row,
  Col,
  Grid,
} from '@sketchpixy/rubix'

export default class Footer extends React.Component {
  state = {
    version: 0
  }

  componentDidMount() {
    this.setState({
      version: document.body.getAttribute('data-version')
    })
  }

  render() {
    const year = new Date().getFullYear();
    return (
      <div id='footer-container'>
        <Grid id='footer' className='text-center'>
          <Row>
            <Col xs={12}>
              <div>&copy;{year} eSentire<sup>&reg;</sup> Inc. All Rights Reserved. v{this.state.version} | <a href="https://www.esentire.com/privacy-policy/" target="_blank">Privacy Policy</a> | <a href="https://www.esentire.com/terms-and-conditions/" target="_blank">Terms and Conditions</a> | <a href="https://www.esentire.com/accessibility/" target="_blank">Accessibility</a></div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
