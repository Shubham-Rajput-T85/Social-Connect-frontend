export const formatCount = (count: number): string => {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return count.toString();
  };
  

  // Utility: compute relative time
const getRelativeTime = (dateStr: string) => {
  const now = new Date();
  const commentDate = new Date(dateStr);
  const diffMs = now.getTime() - commentDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  return `${diffMonths}mo`;
};

export const getRelativeTimeWithEdit = (createdAt: string, updatedAt?: string) => {
  const createdTime = getRelativeTime(createdAt);
  if (!updatedAt || createdAt === updatedAt) return createdTime;
  const updatedTime = getRelativeTime(updatedAt);
  return `${createdTime} • edited ${updatedTime}`;
};