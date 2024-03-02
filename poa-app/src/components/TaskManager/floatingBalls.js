// components/TaskManager/FloatingBalls.js

import React from 'react';
import useBouncingBalls from './useBouncingBalls';
import styles from '../../styles/floatingBalls.module.css';

const FloatingBalls = ({containerRef}) => {
  const { redBallPos, blueBallPos,blackBallPos, cornflowerBallPos } = useBouncingBalls(containerRef);

  return (
    <div className={styles.floatingBalls}>

      <div
        className={styles.ball + ' ' + styles.blueBall}
        style={{ left: blueBallPos.x, top: blueBallPos.y }}
      ></div>
      <div
        className={styles.ball + ' ' + styles.redBall}
        style={{ left: redBallPos.x, top: redBallPos.y }}
      ></div>
      <div
        className={styles.ball + ' ' + styles.cornflowerBall}
        style={{ left: cornflowerBallPos.x, top: cornflowerBallPos.y }}
      ></div>
    </div>
  );
};

export default FloatingBalls;
