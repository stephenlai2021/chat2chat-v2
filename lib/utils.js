import moment from "moment";

export const getToday = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const today = `${month}/${day}/${year}`;
  // const today = `${month}/${day}`;
  return today;
};

export const getYesterday = () => {
  const date = new Date();
  const day = date.getDate() - 1;
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const yesterday = `${month}/${day}/${year}`;
  // const yesterday = `${month}/${day}`;
  return yesterday;
};

// Format: 03/12/2024
export const formatDate = (timestamp) => {
  const date = timestamp?.toDate();
  const momentDate = moment(date);
  return momentDate.format("l");
  // return momentDate.format("MM/DD");
};

// 2:21PM
export const formatTimeClock = (timestamp) => {
  const date = timestamp?.toDate();
  const momentDate = moment(date);
  // return momentDate.format("LT");
  return momentDate.format("HH:mm");
};

/* 
    時間格式 
    - a few seconds ago
    - 6 minutes ago
    - 3 hours ago
    - 5 days ago
  */
export const formatTimeAgo = (timestamp) => {
  const date = timestamp?.toDate();
  const momentDate = moment(date);
  return momentDate.fromNow();
};
