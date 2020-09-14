import React from 'react'

import css from './Panel.css'

export default function () {
  return (
    <div className={css.scrollContainer}>
      <div className={css.oneColumn}>
        <div className={css.body}>
          <p>It is with great sadness that we mark the death
        of our friend Tom, great tennis player, super bass player and impeccable
        gentleman. Thanks for all the happy hours on the courts.
          </p>
          <center>
            <img src='images/smythe-piggott-2015.jpg' style={{ width: '80%', alignSelf: 'center' }} />
          </center>
          <p />
        </div>
      </div>
    </div>
  )
}
