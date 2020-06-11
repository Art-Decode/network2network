import React, { useState } from 'react';
import { Fieldset, Window, WindowContent } from 'react95';

const ValidatorCard = ({ image, address, balance }) => {
  return (
    <Window>
      <WindowContent>
        <Fieldset>
          {image && <img style={{maxHeight: "500px"}} src={`data:image/jpeg;base64,${image}`} />}
          <p>{address}</p>
          <p>{balance}</p>
        </Fieldset>
      </WindowContent>
    </Window>
  );
};

export default ValidatorCard;
