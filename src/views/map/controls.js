import { defer, random } from 'lodash'
import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import userLocation from '../../models/user-location.js'
import settings from '../../models/settings.js'

const lastMoveDirection = observable(null)

const handleMove = action((direction) => {
  const speedCoeff = settings.speedLimit.get()
  const move = (direction.indexOf('UP') !== -1 || direction.indexOf('DOWN') !== -1 ) ?
    random(0.0000300, 0.000070, true) / speedCoeff :
    random(0.0000700, 0.000070, true) / speedCoeff
  const diagonal_move = move * .7937

  let newLocation
  switch (direction) {
  case 'LEFT': { newLocation = [ userLocation[0], userLocation[1] - move ]; break }
  case 'RIGHT': { newLocation = [ userLocation[0], userLocation[1] + move ]; break }
  case 'DOWN': { newLocation = [ userLocation[0] - move, userLocation[1] ]; break }
  case 'UP': { newLocation = [ userLocation[0] + move, userLocation[1] ]; break }
  case 'UP-LEFT': { newLocation = [ userLocation[0] + diagonal_move, userLocation[1] - diagonal_move ]; break }
  case 'UP-RIGHT': { newLocation = [ userLocation[0] + diagonal_move, userLocation[1] + diagonal_move ]; break }
  case 'DOWN-LEFT': { newLocation = [ userLocation[0] - diagonal_move, userLocation[1] - diagonal_move ]; break }
  case 'DOWN-RIGHT': { newLocation = [ userLocation[0] - diagonal_move, userLocation[1] + diagonal_move ]; break }
  default: { newLocation = [ userLocation[0], userLocation[1] ] }
  }

  userLocation.replace(newLocation)

  // we set `lastMoveDirection` to `null` for react re-render without class `.last`
  lastMoveDirection.set(null)
  if (direction.indexOf('LEFT') !== -1) defer(action(() => lastMoveDirection.set('LEFT')))
  if (direction.indexOf('RIGHT') !== -1) defer(action(() => lastMoveDirection.set('RIGHT')))
  if (direction.indexOf('DOWN') !== -1) defer(action(() => lastMoveDirection.set('DOWN')))
  if (direction.indexOf('UP') !== -1) defer(action(() => lastMoveDirection.set('UP')))
})

window.addEventListener('keydown', (e) => {

  if (e.target.tagName.toLowerCase() == 'input' || e.target.tagName.toLowerCase() == 'textarea') return undefined;
  
  switch (e.keyCode) {
  case 81:
  case 55: {
      return handleMove('UP-LEFT');
    }
  case 90:
  case 49: {
      return handleMove('DOWN-LEFT');
    }
  case 69:
  case 57: {
      return handleMove('UP-RIGHT');
    }
  case 67:
  case 51: {
      return handleMove('DOWN-RIGHT');
    }
  case 65:
  case 52:
  case 37: {
      return handleMove('LEFT');
    }
  case 87:
  case 56:
  case 38: { 
      return handleMove('UP');
    }
  case 68:
  case 54:
  case 39: {
      return handleMove('RIGHT');
    }
  case 88:
  case 83:
  case 50:
  case 40: {
      return handleMove('DOWN');
    }
  default: return undefined
  }
})

const Controls = observer(() =>
  <div className='controls'>
    { [ 'UP', 'DOWN', 'LEFT', 'RIGHT' ].map(direction =>
      <span
        key={ direction }
        onClick={ () => handleMove(direction) }
        className={ cx(
          `octicon octicon-arrow-${direction.toLowerCase()}`,
          { last: lastMoveDirection.get() === direction }
        ) } />
    ) }
  </div>
)

export default Controls
