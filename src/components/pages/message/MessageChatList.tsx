// import React, { useEffect, useRef } from "react";
// import { Box, Typography } from "@mui/material";
// import MessageChat from "./MessageChat";
// import { IMessage } from "../../../api/services/message.service";


// interface Props {
//   messages: IMessage[];
// }

// const MessageChatList: React.FC<Props> = ({ messages }) => {
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const isSameDay = (d1: Date, d2: Date) =>
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate();

//   const formatDate = (date: Date) => {
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (isSameDay(date, today)) return "Today";
//     if (isSameDay(date, yesterday)) return "Yesterday";

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <Box
//       sx={{
//         flex: 1,
//         overflowY: "auto",
//         p: 2,
//         display: "flex",
//         flexDirection: "column",
//         gap: 1,
//         width: "100%",
//       }}
//     >
//       {messages.map((msg, index) => {
//         const msgDate = new Date(msg.timestamp);
//         const showDateSeparator =
//           index === 0 ||
//           !isSameDay(new Date(messages[index - 1].timestamp), msgDate);

//         return (
//           <React.Fragment key={msg.id}>
//             {showDateSeparator && (
//               <Typography
//                 variant="caption"
//                 sx={{
//                   textAlign: "center",
//                   color: "text.secondary",
//                   my: 1,
//                   fontSize: "0.75rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 {formatDate(msgDate)}
//               </Typography>
//             )}
//             <MessageChat message={msg} />
//           </React.Fragment>
//         );
//       })}
//       <div ref={messagesEndRef} />
//     </Box>
//   );
// };

// export default MessageChatList;

import React from 'react'

const MessageChatList = () => {
  return (
    <div>
      
    </div>
  )
}

export default MessageChatList


