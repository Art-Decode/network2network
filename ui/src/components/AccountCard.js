import React from 'react';
import { Grid } from '@material-ui/core';
import { Fieldset, Window, WindowContent, Hourglass } from 'react95';
import Typography from '@material-ui/core/Typography';

const AccountCard = ({ image, address, balance }) => {
  return (
    <Window>
      <WindowContent>
        <Grid container spacing={2}>
          <Fieldset>
            {image === null ? (
              <Hourglass size={60}></Hourglass>
            ) : (
              <img
                alt="logo"
                style={{ maxHeight: '500px' }}
                src={`data:image/jpeg;base64,${image}`}
              />
            )}
          </Fieldset>
          <Fieldset>
            <Typography variant="h5" gutterBottom>
              <span role="img" aria-label="address">
                🌴 Address 🌴
              </span>
            </Typography>
            <p>{address}</p>
            <br />
            <Typography variant="h5" gutterBottom>
              <span role="img" aria-label="balance">
                💴 Balance 💴
              </span>
            </Typography>

            <p>{balance}</p>
          </Fieldset>
        </Grid>
      </WindowContent>
    </Window>
  );
};

export default AccountCard;
