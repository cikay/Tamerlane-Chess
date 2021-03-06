import React, { useRef, useCallback } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { List, Grid } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  })
)

export default function PinnedSubheaderList(props) {
  const { moves } = props
  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  const classes = useStyles()
  console.log('moves', moves)
  const handleClick = () => {
    console.log('cliked')
  }

  return (
    <List
      ref={setRef}
      className={classes.root}
      subheader={<li />}
      button
      onClick={handleClick}
      style={{ overflow: 'auto' }}
    >
      {moves &&
        moves.map((move, index) => {
          const { w, b } = move
          return (
            <>
              <ListItem key={index}>
                <ListItemText key={index + 1} primary={`${index + 1}.`} />
                <ListItemText
                  key={`${index}-w`}
                  primary={`from: ${w.from} to:${w.to}`}
                  inset={true}
                />
                {b && (
                  <ListItemText
                    key={`${index}-b`}
                    button
                    inset={true}
                    primary={`from: ${b.from} to:${b.to}`}
                  />
                )}
              </ListItem>
              {/* {b && (
                <ListItem key={index} button onClick={handleClick}>
                  <ListItemText
                    key={`${index}-b`}
                    primary={`from: ${b.from} to:${b.to}`}
                  />
                </ListItem>
              )} */}
            </>
          )
        })}
    </List>
  )
}
