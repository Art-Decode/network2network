import React from 'react';
import { Fieldset, Window, WindowContent, Hourglass } from 'react95';

const ValidatorCard = ({ image, address, balance }) => {
  return (
    <Window>
      <WindowContent>
        <Fieldset>
          {image === null ? (
            <Hourglass size={60}></Hourglass>
          ) : (
            <img
              style={{ maxHeight: '500px' }}
              src={`data:image/jpeg;base64,${image}`}
              alt="anime"
            />
          )}
          <p>{address}</p>
          <p>{balance}</p>
        </Fieldset>
      </WindowContent>
    </Window>
  );
};

export default ValidatorCard;
