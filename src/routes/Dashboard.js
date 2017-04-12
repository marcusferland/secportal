import React from 'react'
import ReactDOM from 'react-dom'
import D3Funnel from 'd3-funnel'
import axios from 'axios'

import {
  Row,
  Col,
  Nav,
  Grid,
  Label,
  Panel,
  Button,
  NavItem,
  PanelBody,
  PanelContainer,
} from '@sketchpixy/rubix'

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invited: this.props.invited ? true : false,
      invitedText: this.props.invited ? 'invited' : 'invite'
    };
  }
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      invited: !this.state.invited,
      invitedText: (!this.state.invited) ? 'invited': 'invite'
    });
  }
  render() {
    return (
      <tr>
        <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}}>
          <img src={`/imgs/app/avatars/${this.props.avatar}.png`} />
        </td>
        <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}}>
          {this.props.name}
        </td>
        <td style={{verticalAlign: 'middle', borderTop: this.props.noBorder ? 'none': null}} className='text-right'>
          <Button onlyOnHover bsStyle='orange' active={this.state.invited} onClick={::this.handleClick}>
            {this.state.invitedText}
          </Button>
        </td>
      </tr>
    );
  }
}

class FunnelChart extends React.Component {
  componentDidMount() {
    Highcharts.setOptions({
      colors: ['#2EB398', '#EA7882', '#4C9AF1', '#FFC497', '#68A0A5'],
      lang: {
        thousandsSep: ','
      }
    })
    Highcharts.chart('funnel', {
      chart: {
        type: 'funnel',
        marginRight: 100
      },
      title: {
        text: null
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            softConnector: true
          },
          neckWidth: '30%',
          neckHeight: '25%'

          //-- Other available options
          // height: pixels or percent
          // width: pixels or percent
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Funnel Chart',
        data: [
          ['Raw Events', 25654],
          ['Filtered Events', 8624],
          ['Automatic Notifications', 2568],
          ['Sent Alerts', 976],
          ['Escalated Events', 543]
        ]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 399
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            yAxis: {
              labels: {
                align: 'center',
                x: 0,
                y: -5
              },
              title: {
                text: null
              }
            },
            subtitle: {
              text: null
            },
            credits: {
              enabled: false
            }
          }
        }]
      }
    })
    /** const data = [
      ['Raw Events', 129653],
      ['Filtered Events', 99864],
      ['Sent Alerts', 15234],
      ['Escalated Events', 50],
    ];
    const options = {
      block: {
        dynamicHeight: false
      },
      chart:{
        height: '95%',
        width: '100%',
        bottomPinch: 1
      },
      label: {
        format: "{l}:\n{f}"
      }
    }
    const chart = new D3Funnel('#funnel')
    chart.draw(data, options) */
  }
  render() {
    return (
      <PanelBody style={{paddingTop: 10}}>
        <div id='funnel' style={{
          maxWidth: '600px',
          height: '100%',
          margin: '0 0 0 -25px',
          paddingBottom: '10px'
        }}></div>
      </PanelBody>
    );
  }
}

export default class Dashboard extends React.Component {
  constructor(props, context) {
    super()
    this.state = {
      threats: {
        total: '',
        low: '',
        high: ''
      },
      disrupted_connections: {
        total: '',
        low: '',
        high: ''
      },
      auto_notifications: {
        total: '',
        low: '',
        high: ''
      },
      messages: {
        total: '',
        low: '',
        high: ''
      },
      escalated_events: {
        total: '',
        low: '',
        high: ''
      }
    }
  }
  nFormatter(num = 0) {
    if (num >= 1000000000)
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'

    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'

    if (num >= 1000)
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'

    return num
  }

  randomFloatBetween(minValue, maxValue, precision = 2, num = 30) {
    const arr = []
    for (let i = 0; i <= num; i++) {
      arr.push( parseInt( Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision) ) )
    }
    return arr
  }

  updateState(key, value, stateObj) {
    stateObj[key] = value

    this.setState({
      stateObj
    })
  }

  componentDidMount() {
    let threats = {}
    axios
      .get('http://localhost:3002/api/v1/threats/total')
      .then(response => {
        if (response.status == 200) {
          threats = {
            count: response.data.count
          }

          const dynamic_data = {
            threats: this.randomFloatBetween(100000, 200000),
            disrupted_connections: this.randomFloatBetween(100000, 200000),
            auto_notifications: this.randomFloatBetween(1000, 10000),
            messages: this.randomFloatBetween(500, 1000),
            escalated_events: this.randomFloatBetween(0, 100),
          }

          this.updateState('total', this.nFormatter(dynamic_data.threats[dynamic_data.threats.length - 1]), this.state.threats)
          this.updateState('low',   this.nFormatter( Math.min.apply(Math, dynamic_data.threats) ), this.state.threats)
          this.updateState('high',  this.nFormatter( Math.max.apply(Math, dynamic_data.threats) ), this.state.threats)

          this.updateState('total', this.nFormatter(dynamic_data.disrupted_connections[dynamic_data.disrupted_connections.length - 1]), this.state.disrupted_connections)
          this.updateState('low',   this.nFormatter( Math.min.apply(Math, dynamic_data.disrupted_connections) ), this.state.disrupted_connections)
          this.updateState('high',  this.nFormatter( Math.max.apply(Math, dynamic_data.disrupted_connections) ), this.state.disrupted_connections)

          this.updateState('total', this.nFormatter(dynamic_data.auto_notifications[dynamic_data.auto_notifications.length - 1]), this.state.auto_notifications)
          this.updateState('low',   this.nFormatter( Math.min.apply(Math, dynamic_data.auto_notifications) ), this.state.auto_notifications)
          this.updateState('high',  this.nFormatter( Math.max.apply(Math, dynamic_data.auto_notifications) ), this.state.auto_notifications)

          this.updateState('total', this.nFormatter(dynamic_data.messages[dynamic_data.messages.length - 1]), this.state.messages)
          this.updateState('low',   this.nFormatter( Math.min.apply(Math, dynamic_data.messages) ), this.state.messages)
          this.updateState('high',  this.nFormatter( Math.max.apply(Math, dynamic_data.messages) ), this.state.messages)

          this.updateState('total', this.nFormatter(dynamic_data.escalated_events[dynamic_data.escalated_events.length - 1]), this.state.escalated_events)
          this.updateState('low',   this.nFormatter( Math.min.apply(Math, dynamic_data.escalated_events) ), this.state.escalated_events)
          this.updateState('high',  this.nFormatter( Math.max.apply(Math, dynamic_data.escalated_events) ), this.state.escalated_events)

          $(ReactDOM.findDOMNode(this.refs.threats)).sparkline(dynamic_data.threats, {composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''})
          $(ReactDOM.findDOMNode(this.refs.disrupted_connections)).sparkline(dynamic_data.disrupted_connections, {composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''})
          $(ReactDOM.findDOMNode(this.refs.auto_notifications)).sparkline(dynamic_data.auto_notifications, {composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''})
          $(ReactDOM.findDOMNode(this.refs.messages)).sparkline(dynamic_data.messages, {composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''})
          $(ReactDOM.findDOMNode(this.refs.escalated_events)).sparkline(dynamic_data.escalated_events, {composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''})
        }
      })
      .catch( error => console.log(error) )
  }
  render() {
    return (
      <div className='dashboard'>
        <Row style={{lineHeight: 1}}>
          <div className='dashboard-widgets'>
            <Col className='col-sm-2_5 text-center'>
              <PanelContainer>
                <Panel>
                  <PanelBody style={{padding: '25px'}}>
                    <div style={{
                      color: 'black',
                      display: 'block',
                      fontSize: '50px',
                      fontWeight: 100
                    }}>{this.state.threats.total}</div>
                    <div style={{marginBottom: '25px'}}>Threats</div>
                    <div ref='threats'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.threats.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.threats.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
            <Col className='col-sm-2_5 text-center'>
              <PanelContainer>
                <Panel>
                  <PanelBody style={{padding: '25px'}}>
                    <div style={{
                      color: 'black',
                      display: 'block',
                      fontSize: '50px',
                      fontWeight: 100
                    }}>{this.state.disrupted_connections.total}</div>
                    <div style={{marginBottom: '25px'}}>Disrupted Connections</div>
                    <div ref='disrupted_connections'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.disrupted_connections.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.disrupted_connections.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
            <Col className='col-sm-2_5 text-center'>
              <PanelContainer>
                <Panel>
                  <PanelBody style={{padding: '25px'}}>
                    <div style={{
                      color: 'black',
                      display: 'block',
                      fontSize: '50px',
                      fontWeight: 100
                    }}>{this.state.auto_notifications.total}</div>
                    <div style={{marginBottom: '25px'}}>Automatic Notifications</div>
                    <div ref='auto_notifications'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.auto_notifications.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.auto_notifications.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
            <Col className='col-sm-2_5 text-center'>
              <PanelContainer>
                <Panel>
                  <PanelBody style={{padding: '25px'}}>
                    <div style={{
                      color: 'black',
                      display: 'block',
                      fontSize: '50px',
                      fontWeight: 100
                    }}>{this.state.messages.total}</div>
                    <div style={{marginBottom: '25px'}}>Messages</div>
                    <div ref='messages'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.messages.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.messages.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
            <Col className='col-sm-2_5 text-center'>
              <PanelContainer>
                <Panel>
                  <PanelBody style={{padding: '25px'}}>
                    <div style={{
                      color: 'black',
                      display: 'block',
                      fontSize: '50px',
                      fontWeight: 100
                    }}>{this.state.escalated_events.total}</div>
                    <div style={{marginBottom: '25px'}}>Escalated Events</div>
                    <div ref='escalated_events'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.escalated_events.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.escalated_events.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </div>
        </Row>
        <Row>
          <Col sm={5} collapseRight>
            <PanelContainer>
              <Panel>
                <PanelBody style={{padding: 0}}>
                  <Grid>
                    <Row>
                      <FunnelChart />
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
      </div>
    )
  }
}
