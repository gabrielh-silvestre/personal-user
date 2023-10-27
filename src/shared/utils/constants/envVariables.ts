export const TOKEN_SECRET = 'JWT_SECRET';
export const TOKEN_EXP = 'JWT_EXPIRES_IN';

export const AWS_REGION = 'AWS_REGION';
export const AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID';
export const AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY';

export const BUCKET_NAME = 'S3_BUCKET';

export const SQS_ENDPOINT = 'SQS_ENDPOINT';
export const SQS_TOPIC_ARN = (topicName: string) =>
  `SQS_TOPIC_ARN_${topicName.toUpperCase()}`;

export const SQS_GROUP_TOPIC_ARN = (groupId: string) =>
  `SQS_GROUP_TOPIC_ARN_${groupId.toUpperCase()}`;
