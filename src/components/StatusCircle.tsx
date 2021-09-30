import React, { FunctionComponent } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core"
export interface Props {
    connected?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statusCircle: {
      display: "inline-block",
      width: "10px",
      height: "10px",
      borderRadius: "10px",
      border: "1px solid #16DB9A",
    },
  }),
)

const StatusCircle: FunctionComponent<Props> = ({connected}: Props) => {
  const classes = useStyles()
  const circleBg = connected ? "#16DB9A" : "transparent"
  return (
    <div className={classes.statusCircle} style={{ backgroundColor: circleBg }} />
  );
}

export default StatusCircle;
