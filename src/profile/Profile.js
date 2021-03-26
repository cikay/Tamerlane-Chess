import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import withProvider from '../shared/hoc/withProvider'
import GameCardContainer from './shared/components/GameCardContainer'
import { ProfileProvider } from './shared/contexts/ProfileContext'

function Profile() {
  return (
    <Container>
      <Row>
        <Col sm={12} md={2}></Col>
        <Col sm={12} md={8}>
          <GameCardContainer />
        </Col>
        <Col sm={12} md={2}></Col>
      </Row>
    </Container>
  )
}

export default withProvider(Profile, ProfileProvider)
