import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import la from './loadableComponent'

const Home = () => import('pages/Home')

export default () => (
  <Switch>
    <Route path='/' render={() => <Redirect to='/home' />} exact key='first' />
    <Route path='/home' component={la(Home)} key='home' exact />
  </Switch>
)
