import React, { useState } from 'react';
import {
  Fieldset,
  Window,
  WindowContent,
  WindowHeader,
  Tabs,
  TabBody,
  Tab,
} from 'react95';

const AccountCard = ({ image, address, balance }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Window>
      <WindowContent>
        <WindowHeader>💰 My Wallet</WindowHeader>
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <Tab value={0} onClick={() => setActiveTab(0)}>
            Avatar
          </Tab>

          <Tab value={1} onClick={() => setActiveTab(1)}>
            My Tokens
          </Tab>

          <Tab value={2} onClick={() => setActiveTab(2)}>
            History
          </Tab>
        </Tabs>
        {activeTab === 0 && (
          <TabBody>
            <Fieldset>
              {image && <img src={`data:image/jpeg;base64,${image}`} />}
              <p>{address}</p>
              <p>{balance}</p>
            </Fieldset>
          </TabBody>
        )}
        {activeTab === 1 && (
          <TabBody>
            <Fieldset>
              {image && <img src={`data:image/jpeg;base64,${image}`} />}
              <p>{address}</p>
              <p>{balance}</p>
            </Fieldset>
          </TabBody>
        )}
        {activeTab === 2 && (
          <TabBody>
            <Fieldset>
              {image && <img src={`data:image/jpeg;base64,${image}`} />}
              <p>{address}</p>
              <p>{balance}</p>
            </Fieldset>
          </TabBody>
        )}
      </WindowContent>
    </Window>
  );
};

export default AccountCard;
