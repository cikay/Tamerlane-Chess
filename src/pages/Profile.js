import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import GameCardContainer from '../components/GameCardContainer'
export default function Profile() {
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
