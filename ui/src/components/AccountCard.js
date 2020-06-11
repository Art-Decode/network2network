import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Fieldset, Window, WindowContent } from 'react95';
import Typography from '@material-ui/core/Typography';

const AccountCard = ({ image, address, balance }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Window>
      <WindowContent>
        <Grid container spacing={2}>
          <Fieldset>
            {image && <img src={`data:image/jpeg;base64,${image}`} />}
          </Fieldset>
          <Fieldset>
            <Typography variant="h5" gutterBottom>
              🌴 Address 🌴{' '}
            </Typography>
            <p>{address}</p>
            <br />
            <Typography variant="h5" gutterBottom>
              💴 Balance 💴{' '}
            </Typography>

            <p>{balance}</p>
          </Fieldset>
        </Grid>
      </WindowContent>
    </Window>
  );
};

export default AccountCard;
