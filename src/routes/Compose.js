import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  FormControl,
  ButtonGroup,
  ControlLabel,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix';

class TrumbowygEditor extends React.Component {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this._el))
      .trumbowyg({
        autogrow: true,
        dir: $('html').attr('dir'),
        btns: [
          ['viewHTML'],
          ['undo', 'redo'],
          ['formatting'],
          'btnGrp-semantic',
          ['superscript', 'subscript'],
          ['link'],
          ['insertImage'],
          'btnGrp-justify',
          'btnGrp-lists',
          ['horizontalRule'],
          ['removeformat'],
        ]
      })
      .trumbowyg('html', '<p>Steve Jobs became the greatest business executive of our era, the one most certain to be remembered a century from now. History will place him in the pantheon right next to Edison and Ford. More than anyone else of his time, he made products that were completely innovative, combining the power of poetry and processors.</p>');
  }

  render() {
    return <div id='trumbowyg' name='body' ref={(el) => this._el = el}></div>;
  }
}

@withRouter
export default class Compose extends React.Component {

  constructor(props, context) {
    super(props)

    this.state = {
      errors: {},
      form: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: ''
      }
    };

    this.processForm = this.processForm.bind(this)
    this.changeInput = this.changeInput.bind(this)
  }

  handleClick(e) {
    this.props.router.push('/ltr/mailbox/inbox');
  }

  processForm(e) {
    e.preventDefault()

    const to = this.state.form.to;
    const cc = this.state.form.cc;
    const bcc = this.state.form.bcc;
    const subject = this.state.form.subject;
    const body = this.state.form.body;
    console.log(body)
  }

  changeInput(event) {
    const field = event.target.name
    const form = this.state.form
    form[field] = event.target.value
    console.log(form[field])

    this.setState({
      form
    })
  }

  render() {
    return (
      <PanelContainer className='inbox'>
        <Panel>
          <PanelBody style={{paddingTop: 0}}>
            <Grid>
              <Row>
                <Col xs={8} style={{paddingTop: 12.5}}>
                  <ButtonToolbar className='inbox-toolbar'>
                    <ButtonGroup>
                      <Button outlined onlyOnHover bsStyle='darkgreen45' onClick={::this.handleClick}><Icon glyph='icon-dripicons-return'/></Button>
                      <Button outlined onlyOnHover bsStyle='danger' onClick={::this.handleClick}><Icon glyph='icon-feather-cross'/></Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
                <Col xs={4} className='text-right'>
                  <div className='inbox-avatar'>
                    <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                    <div className='inbox-avatar-name hidden-xs hidden-sm'>
                      <div>Anna Sanchez</div>
                      <div><small>Compose</small></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
            <hr style={{margin: 0, marginBottom: 25}}/>
            <Panel horizontal>
              <PanelBody className='panel-sm-9 panel-xs-12' style={{ paddingTop: 0 }}>
                <Grid>
                  <Form horizontal style={{marginBottom: 25}} onSubmit={::this.processForm} method='post'>
                    <Row>
                      <Col xs={12}>
                          <FormGroup controlId='email-to'>
                            <Col componentClass={ControlLabel} sm={1}>To</Col>
                            <Col sm={11}>
                              <FormControl name='to' onChange={::this.changeInput} type='email' placeholder='Ex: sender@example.com' autoFocus />
                            </Col>
                          </FormGroup>
                          <FormGroup controlId='email-cc' >
                            <Col componentClass={ControlLabel} sm={1}>CC</Col>
                            <Col sm={11}>
                              <FormControl name='cc' onChange={::this.changeInput} type='email' />
                            </Col>
                          </FormGroup>
                          <FormGroup controlId='email-bcc'>
                            <Col componentClass={ControlLabel} sm={1}>BCC</Col>
                            <Col sm={11}>
                              <FormControl name='bcc' onChange={::this.changeInput} type='email' />
                            </Col>
                          </FormGroup>
                          <FormGroup controlId='email-subject'>
                            <Col componentClass={ControlLabel} sm={1}>Subject</Col>
                            <Col sm={11}>
                              <FormControl name='subject' onChange={::this.changeInput} type='text' placeholder='Enter a subject title here' />
                            </Col>
                          </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col id='trumbowyg-demo-container' xs={12} collapseLeft collapseRight>
                        <TrumbowygEditor onChange={::this.changeInput} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} className='text-right' style={{marginBottom: 16}}>
                        <ButtonToolbar style={{display: 'inline-block'}}>
                          <ButtonGroup>
                            <Button outlined onlyOnHover bsStyle='danger'>discard</Button>
                            <Button outlined onlyOnHover bsStyle='green'>save</Button>
                          </ButtonGroup>
                          <ButtonGroup>
                            <Button type='submit' outlined bsStyle='blue'>send</Button>
                          </ButtonGroup>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </Form>
                </Grid>
              </PanelBody>
            </Panel>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
