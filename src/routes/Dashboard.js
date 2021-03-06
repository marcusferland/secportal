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

import { nFormatter } from '../common/utils'

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
        marginRight: 50
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
  }

  render() {
    return (
      <div id='funnel' style={{
        border: 0,
        maxWidth: '98%',
        height: 'auto',
        margin: '0px',
        paddingBottom: '20px'
      }}></div>
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
      targeted_assets: {
        total: '',
        low: '',
        high: ''
      }
    }
  }

  updateState(key, value, stateObj) {
    stateObj[key] = value

    this.setState({
      stateObj
    })
  }

  getThreats() {
    return axios.get('http://localhost:3002/api/v1/threats/total')
  }
  getDisruptedConnections() {
    return axios.get('http://localhost:3002/api/v1/disrupted_connections/total')
  }
  getAutoNotifications() {
    return axios.get('http://localhost:3002/api/v1/auto_notifications/total')
  }
  getMessages() {
    return axios.get('http://localhost:3002/api/v1/messages/total')
  }
  getTargetedAssets() {
    return axios.get('http://localhost:3002/api/v1/targeted_assets/total')
  }

  componentDidMount() {
    const list = ['messages', 'auto_notifications', 'threats', 'disrupted_connections', 'targeted_assets']
    axios
      .all([
        this.getMessages(),
        this.getAutoNotifications(),
        this.getThreats(),
        this.getDisruptedConnections(),
        this.getTargetedAssets(),
      ])
      .then(response => {

        let newObjState = {}
        for (var i = 0; i < response.length; i++) {
          newObjState[list[i]] = {
            total: nFormatter(response[i].data.count[response[i].data.count.length - 1]),
            low: nFormatter( Math.min.apply(Math, response[i].data.count) ),
            high: nFormatter( Math.max.apply(Math, response[i].data.count) )
          }
          $(ReactDOM.findDOMNode(this.refs[list[i]])).sparkline(response[i].data.count, {
            composite: false, height: '2em', width: '100%', fillColor: false, lineColor: '#7CD5BA', tooltipPrefix: ''
          })
        }
        this.setState(newObjState)
      })
      .catch(err => console.log(err))
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
                    }}>{this.state.messages.total}</div>
                    <div style={{marginBottom: '25px'}}>Total Messages</div>
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
                    }}>{this.state.threats.total}</div>
                    <div style={{marginBottom: '25px'}}>Threats Alerts</div>
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
                    }}>{this.state.targeted_assets.total}</div>
                    <div style={{marginBottom: '25px'}}>Targeted Assets</div>
                    <div ref='targeted_assets'></div>
                    <div style={{paddingTop: '25px'}}>
                      <div className='text-left pull-left'>Low <b>{this.state.targeted_assets.low}</b></div>
                      <div className='text-right pull-right'>High <b>{this.state.targeted_assets.high}</b></div>
                    </div>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </div>
        </Row>
        <Row>
          <Col sm={12} className='funnel-chart'>
            <PanelContainer>
              <Panel>
                <PanelBody>
                  <FunnelChart />
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
      </div>
    )
  }
}
