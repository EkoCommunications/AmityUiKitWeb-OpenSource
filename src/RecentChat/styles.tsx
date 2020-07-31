import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faCommentAltPlus, faCheck, faTimes } from '@fortawesome/pro-regular-svg-icons';

export const CreateIcon = styled(FaIcon).attrs({ icon: faCheck })`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const CloseIcon = styled(FaIcon).attrs({ icon: faTimes })`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const CreateNewChatIcon = styled(FaIcon).attrs({ icon: faCommentAltPlus })`
  font-size: 20px;
  cursor: pointer;
`;

export const RecentChatListHeader = styled.div`
  display: flex;
`;

export const RecentChatListContainer = styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  width: 280px;
  overflow: auto;
  padding: 28px 16px;
  flex-shrink: 0;
`;

export const CreationContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const CreationInput = styled.input`
  height: 34px;
  padding: 6px;
  margin: 5px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
`;

export const CreateNewChatContainer = styled.span`
  margin-left: auto;
`;