import React,{ useContext, useEffect, useState } from 'react';
import { NotificationProps } from '../types';
import { Button, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { CSSTransition } from 'react-transition-group';
import { AppContext } from '../contexts/AppContext';

const useStyles = makeStyles(theme => ({
  '.notification-enter': {
    opacity: '0',
    transform: 'scale(0.9)'
  },
  '.notification-enter-active': {
    opacity: '1',
    transform: 'translateX(0)',
    transition: 'opacity 300ms, transform 300ms'
  },
  '.notification-exit': {
    opacity: '1'
  },
  '.notification-exit-active': {
    opacity: '0',
    transform: 'scale(0.9)',
    transition: 'opacity 300ms, transform 300ms'
  },
  paperBox: {
    opacity: 1,
    minWidth: '350px',
    minHeight: '100px',
    position: 'fixed',
    right: '10px',
    top: '10px',
    padding: '0 10px',
    zIndex: 9999
  },
  closeNotification: {
    position: 'absolute',
    right: '0'
  },
  title: {
    width: '90%',
    margin: '15px 0'
  },
  text: {
    width: '95%',
    margin: '10px 0'
  },
  notifButton: {
   border: '1px solid #ccc',
   margin: '10px 0'
  }
}));

const Notification = ({
    show = false,
    title,
    text,
    buttonText,
    buttonAction,
    autoClose
  }: NotificationProps) => {
  const classes = useStyles();
  const appCtx = useContext(AppContext);
  const [showNotification, setShowNotification] = useState<boolean>(show)

  useEffect(() => {
    setShowNotification(show);
    if (autoClose) {
      const timer = setTimeout(() => {
        appCtx.setNotification({ ...appCtx.notification, show: false });
        setShowNotification(false);
      }, autoClose);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [show])

  return (
    <CSSTransition
      in={showNotification}
      timeout={300}
      classNames={{
        enter: classes['.notification-enter'],
        enterActive: classes['.notification-enter-active'],
        exit: classes['.notification-exit'],
        exitActive: classes['.notification-exit-active']
        }}
      unmountOnExit
    >
      <Paper elevation={3} className={classes.paperBox}>
        {!autoClose && (
          <IconButton onClick={() => {
            setShowNotification(false)
            appCtx.setNotification({ ...appCtx.notification, show: false });
          }} className={classes.closeNotification}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        {title && <Typography variant='body1' className={classes.title}>{title}</Typography>}
        <Typography variant='body2' className={classes.text}>{text}</Typography>
        {buttonText && buttonAction &&
          (
            <Button className={classes.notifButton} onClick={buttonAction}>{buttonText}</Button>
          )
        }
      </Paper>
    </CSSTransition>
  );
};

export default Notification;