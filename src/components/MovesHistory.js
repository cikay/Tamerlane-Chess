// import React from 'react'

// export default function Move({ moves }) {
//   return (
//     <>
//       {moves.map((move) => {
//         const { from, to } = move
//         return (
//           <h1>
//             from:{from}, to:{to}
//           </h1>
//         )
//       })}
//     </>
//   )
// }

// import React from 'react'
// // import PropTypes from 'prop-types'
// import { makeStyles } from '@material-ui/core/styles'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemText from '@material-ui/core/ListItemText'
// import { FixedSizeList } from 'react-window'

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     height: 400,
//     maxWidth: 300,
//     backgroundColor: theme.palette.background.paper,
//   },
// }))

// function Move({ move, index }) {
//   return (
//     <ListItem button key={index}>
//       <ListItemText
//         primary={`${index + 1}. from: ${move.from}, to: ${move.to}`}
//       />
//     </ListItem>
//   )
// }

// export default function VirtualizedList({ movesHistory }) {
//   const classes = useStyles()

//   return (
//     <div className={classes.root}>
//       <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
//         {/* {movesHistory?.map((move, index) => {
//           return <Move key={index} move={move} index={index} />
//         })} */}
//         {Move}
//       </FixedSizeList>
//     </div>
//   )
// }

// import React from 'react'
// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemText from '@material-ui/core/ListItemText'
// import { FixedSizeList, ListChildComponentProps } from 'react-window'

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       width: '100%',
//       height: 400,
//       maxWidth: 300,
//       backgroundColor: theme.palette.background.paper,
//     },
//   })
// )

// function renderRow(props: ListChildComponentProps) {
//   const { index, style } = props
//   console.log(style)
//   return (
//     <ListItem button style={style} key={index}>
//       <ListItemText primary={`Item ${index + 1}`} />
//     </ListItem>
//   )
// }

// export default function VirtualizedList() {
//   const classes = useStyles()

//   return (
//     <div className={classes.root}>
//       <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
//         {renderRow}
//       </FixedSizeList>
//     </div>
//   )
// }

import React from 'react'
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
  const classes = useStyles()
  console.log('moves', moves)
  const handleClick = () => {
    console.log('cliked')
  }

  return (
    <List
      className={classes.root}
      subheader={<li />}
      button
      onClick={handleClick}
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
