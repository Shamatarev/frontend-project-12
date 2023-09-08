import React from 'react';
import { Button } from 'react-bootstrap';
import cn from 'classnames';
import ChannelName from '../../common/ChannelName.jsx';

const SimpleButton = ({
  channel, isActive, name = channel.name, onClick,
}) => {
  const classNameMainButton = cn('w-100 rounded-0 text-start btn', { 'btn-secondary': isActive });

  return (
    <Button type="button" className={classNameMainButton} onClick={() => onClick(channel.id)}>
      <ChannelName name={name} />
    </Button>
  );
};

export default SimpleButton;
