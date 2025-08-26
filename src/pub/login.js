// LICENSE_CODE ZON ISC
'use strict'; /*jslint react:true, es6:true*/
import React from 'react';
import {withRouter} from 'react-router-dom';
import Pure_component from '/www/util/pub/pure_component.js';
import etask from '../../util/etask.js';
import setdb from '../../util/setdb.js';
import {Loader, Logo} from './common.js';
import {main as Api} from './api.js';
import './css/login.less';

const Login = withRouter(class Login extends Pure_component {
    state = {
        loading: true,
        error_message: '',
    };
    componentDidMount(){
        this.get_in();
    }
    get_in = ()=>{
        const _this = this;
        return this.etask(function*(){
            this.on('uncaught', e=>{
                _this.setState({
                    loading: false,
                    error_message: 'Cannot sign in: '+e.message,
                });
            });
            const ets = [];
            ets.push(etask(function*_get_settings(){
                const settings = yield Api.json.get('settings');
                setdb.set('head.settings', settings);
            }));
            ets.push(etask(function*_get_consts(){
                const consts = yield Api.json.get('consts');
                setdb.set('head.consts', consts);
            }));
            const curr_locations = setdb.get('head.locations');
            if (!curr_locations || !curr_locations.shared_countries)
            {
                ets.push(etask(function*_get_locations(){
                    const locations = yield Api.json.get('all_locations');
                    setdb.set('head.locations', locations);
                }));
            }
            ets.push(etask(function*_get_zones(){
                const zones = yield Api.json.get('zones');
                setdb.set('ws.zones', zones);
            }));
            ets.push(etask(function*_get_proxies_running(){
                const proxies = yield Api.json.get('proxies_running');
                setdb.set('head.proxies_running', proxies);
            }));
            yield etask.all(ets);
            _this.props.history.push('/overview');
        });
    };
    render(){
        return <div className="lum_login">
          <Logo/>
          <Loader show={this.state.loading}/>
          {this.state.error_message &&
            <div className="warning error settings-alert">
              <div dangerouslySetInnerHTML={{__html: this.state.error_message}}/>
            </div>
          }
        </div>;
    }
});

export default Login;
