import child_process from "child_process";
import dayjs from "dayjs";

export function getGitCommitHash() {
  const output = child_process.execSync(`git rev-parse HEAD`);
  return output.toString();
}

export function getTimestamp() {
  const now = dayjs();
  return now.toISOString();
}
